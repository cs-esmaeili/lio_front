import type { AxiosProgressEvent, AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';
import {
  CreateFolderResultSchema,
  DirectoryListingSchema,
  FileOkSchema,
  UploadResultSchema,
  type CreateFolderResult,
  type DirectoryListing,
  type FileOk,
  type UploadedFile,
} from '@/typescript/schemas/file-manager.schema';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

/* -------------------------------------------------------------------------- */
/*  Response parsing                                                          */
/* -------------------------------------------------------------------------- */

/** Successful responses are wrapped in `{ statusCode, data, message }`. */
function unwrap(body: unknown): unknown {
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as { data: unknown }).data;
  }
  return body;
}

async function parseResponse<T>(request: Promise<AxiosResponse>, schema: z.ZodType<T>): Promise<T> {
  const response = await request;

  const parsed = schema.safeParse(unwrap(response.data));
  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', parsed.error);
  }

  return parsed.data;
}

/* -------------------------------------------------------------------------- */
/*  File manager — /files?path=, /files/upload, /files/folders, /files/{id}    */
/* -------------------------------------------------------------------------- */

export interface UploadProgress {
  /** 0 – 100 */
  percent: number;
  loaded: number;
  total: number;
}

export interface UploadFilesOptions {
  onProgress?: (progress: UploadProgress) => void;
}

/** GET /files?path= — list folders and files inside `path` (empty = root). */
export const listFilesCSR = (path = ''): Promise<DirectoryListing> => {
  const query = path ? `?path=${encodeURIComponent(path)}` : '';
  return parseResponse(http.get(`${csrPrefixUrl}/files${query}`), DirectoryListingSchema);
};

/** POST /files/upload — upload one or more files into `path`. */
export const uploadFilesCSR = (
  path: string,
  files: File[],
  { onProgress }: UploadFilesOptions = {},
): Promise<UploadedFile[]> => {
  const formData = new FormData();
  formData.append('path', path);
  files.forEach((file) => formData.append('files', file));

  return parseResponse(
    http.post(`${csrPrefixUrl}/files/upload`, formData, {
      // The shared axios instance defaults to JSON — override so axios keeps
      // the FormData intact and lets the browser add the multipart boundary.
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (!onProgress || !event.total) return;
        onProgress({
          percent: Math.round((event.loaded / event.total) * 100),
          loaded: event.loaded,
          total: event.total,
        });
      },
    }),
    UploadResultSchema,
  ).then((result) => result.files);
};

/** POST /files/folders — create a folder at `path`. */
export const createFolderCSR = (path: string): Promise<CreateFolderResult> =>
  parseResponse(http.post(`${csrPrefixUrl}/files/folders`, { path }), CreateFolderResultSchema);

/** DELETE /files/folders?path= — delete a folder and everything inside it. */
export const deleteFolderCSR = (path: string): Promise<FileOk> =>
  parseResponse(http.delete(`${csrPrefixUrl}/files/folders?path=${encodeURIComponent(path)}`), FileOkSchema);

/** DELETE /files/{id} — delete a single file by its id. */
export const deleteFileCSR = (id: number): Promise<FileOk> =>
  parseResponse(http.delete(`${csrPrefixUrl}/files/${id}`), FileOkSchema);
