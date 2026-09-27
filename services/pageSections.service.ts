import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';

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

/** Body shared by create/update: the section `type` plus the item payload. */
export interface SectionItemRequest {
  type: string;
  data: Record<string, unknown>;
}

/* -------------------------------------------------------------------------- */
/*  Page sections — /page-sections, /admin/page-sections/{id}/data            */
/* -------------------------------------------------------------------------- */

/** GET /page-sections/section?location= — read a global section (e.g. SLIDER). */
export function getSectionByLocationCSR<T>(location: string, schema: z.ZodType<T>): Promise<T> {
  const query = encodeURIComponent(location);
  return parseResponse(http.get(`${csrPrefixUrl}/page-sections/section?location=${query}`), schema);
}

/** GET /page-sections/page?entityType= — read a page with all of its sections. */
export function getPageSectionsCSR<T>(entityType: string, schema: z.ZodType<T>): Promise<T> {
  const query = encodeURIComponent(entityType);
  return parseResponse(http.get(`${csrPrefixUrl}/page-sections/page?entityType=${query}`), schema);
}

/** GET /admin/page-sections/{id} — read one section by id. */
export function getSectionByIdCSR<T>(sectionId: number, schema: z.ZodType<T>): Promise<T> {
  return parseResponse(http.get(`${csrPrefixUrl}/admin/page-sections/${sectionId}`), schema);
}

/** POST /admin/page-sections/{id}/data — create an item (no `id` in data). */
export function createSectionItemCSR<T>(sectionId: number, body: SectionItemRequest, schema: z.ZodType<T>): Promise<T> {
  return parseResponse(http.post(`${csrPrefixUrl}/admin/page-sections/${sectionId}/data`, body), schema);
}

/** PATCH /admin/page-sections/{id}/data — update an item (`data.id` required). */
export function updateSectionItemCSR<T>(sectionId: number, body: SectionItemRequest, schema: z.ZodType<T>): Promise<T> {
  return parseResponse(http.patch(`${csrPrefixUrl}/admin/page-sections/${sectionId}/data`, body), schema);
}

/**
 * DELETE /admin/page-sections/{id}/data — delete an item.
 * `itemId` is required for list sections and omitted for singleton ones
 * (INTRODUCTION).
 */
export function deleteSectionItemCSR<T>(sectionId: number, itemId: number | undefined, schema: z.ZodType<T>): Promise<T> {
  const query = itemId === undefined ? '' : `?itemId=${itemId}`;
  return parseResponse(http.delete(`${csrPrefixUrl}/admin/page-sections/${sectionId}/data${query}`), schema);
}
