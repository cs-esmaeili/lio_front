import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  File manager contract — /files                                            */
/* -------------------------------------------------------------------------- */

/** A directory entry (`GET /files`). */
export const FileFolderEntrySchema = z.object({
  type: z.literal('folder'),
  name: z.string(),
  path: z.string(),
});

/** A file entry (`GET /files`). Metadata is optional: orphan files on disk have no DB row. */
export const FileItemEntrySchema = z.object({
  type: z.literal('file'),
  name: z.string(),
  path: z.string(),
  id: z.number().optional(),
  size: z.number().optional(),
  mimeType: z.string().optional(),
  url: z.string().catch(''),
  createdAt: z.string().optional(),
});

export const FileEntrySchema = z.discriminatedUnion('type', [FileFolderEntrySchema, FileItemEntrySchema]);

/** `data` of `GET /files?path=` */
export const DirectoryListingSchema = z.object({
  path: z.string().catch(''),
  entries: z.array(FileEntrySchema).catch([]),
});

/** A file record created by `POST /files/upload`. */
export const UploadedFileSchema = z.object({
  id: z.number(),
  originalName: z.string(),
  storedName: z.string(),
  path: z.string(),
  url: z.string().catch(''),
  mimeType: z.string().catch(''),
  size: z.number().catch(0),
  uploaderId: z.number().nullable().optional(),
  createdAt: z.string().catch(''),
});

/** `data` of `POST /files/upload` */
export const UploadResultSchema = z.object({
  files: z.array(UploadedFileSchema).catch([]),
});

/** `data` of `DELETE /files/{id}` and `DELETE /files/folders`. */
export const FileOkSchema = z.object({
  ok: z.boolean().catch(true),
});

/** `data` of `POST /files/folders`. */
export const CreateFolderResultSchema = z.object({
  ok: z.boolean().catch(true),
  path: z.string().catch(''),
});

export type FileFolderEntry = z.infer<typeof FileFolderEntrySchema>;
export type FileItemEntry = z.infer<typeof FileItemEntrySchema>;
export type FileEntry = z.infer<typeof FileEntrySchema>;
export type DirectoryListing = z.infer<typeof DirectoryListingSchema>;
export type UploadedFile = z.infer<typeof UploadedFileSchema>;
export type FileOk = z.infer<typeof FileOkSchema>;
export type CreateFolderResult = z.infer<typeof CreateFolderResultSchema>;

/** Maximum number of files accepted by a single upload request. */
export const FILE_UPLOAD_MAX_FILES = 20;
/** Maximum size of a single uploaded file (10 MB). */
export const FILE_UPLOAD_MAX_SIZE = 10 * 1024 * 1024;
