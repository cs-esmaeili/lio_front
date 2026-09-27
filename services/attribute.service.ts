import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';
import {
  AdminAttributeListResponseSchema,
  AdminAttributeSchema,
  type AdminAttribute,
  type AttributeUsage,
  type FilterType,
} from '@/typescript/schemas/attribute.schema';

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
/*  Attributes — /admin/attributes                                            */
/* -------------------------------------------------------------------------- */

/** Body shared by create/update. */
export interface AttributePayload {
  name: string;
  title: string;
  usage: AttributeUsage;
  filterType: FilterType;
  isMultiSelect: boolean;
}

/** Body shared by create/update of a value. */
export interface AttributeValuePayload {
  value: string;
  sortOrder?: number;
}

/** GET /admin/attributes — every attribute with its values (requires `attribute:read`). */
export const listAttributesCSR = (): Promise<AdminAttribute[]> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/attributes`), AdminAttributeListResponseSchema).then((result) => result.attributes);

/** GET /admin/attributes/{id} — a single attribute. */
export const getAttributeCSR = (id: number): Promise<AdminAttribute> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/attributes/${id}`), AdminAttributeSchema);

/** POST /admin/attributes — create an attribute. */
export const createAttributeCSR = (payload: AttributePayload): Promise<AdminAttribute> =>
  parseResponse(http.post(`${csrPrefixUrl}/admin/attributes`, payload), AdminAttributeSchema);

/** PATCH /admin/attributes/{id} — update an attribute. */
export const updateAttributeCSR = (id: number, payload: Partial<AttributePayload>): Promise<AdminAttribute> =>
  parseResponse(http.patch(`${csrPrefixUrl}/admin/attributes/${id}`, payload), AdminAttributeSchema);

/** DELETE /admin/attributes/{id} — delete an unused attribute. */
export const deleteAttributeCSR = (id: number): Promise<{ ok: boolean }> =>
  parseResponse(http.delete(`${csrPrefixUrl}/admin/attributes/${id}`), z.object({ ok: z.boolean().catch(true) }));

/** POST /admin/attributes/{id}/values — add a value; returns the whole attribute. */
export const createAttributeValueCSR = (attributeId: number, payload: AttributeValuePayload): Promise<AdminAttribute> =>
  parseResponse(http.post(`${csrPrefixUrl}/admin/attributes/${attributeId}/values`, payload), AdminAttributeSchema);

/** PATCH /admin/attribute-values/{id} — update a value; returns its attribute. */
export const updateAttributeValueCSR = (valueId: number, payload: Partial<AttributeValuePayload>): Promise<AdminAttribute> =>
  parseResponse(http.patch(`${csrPrefixUrl}/admin/attribute-values/${valueId}`, payload), AdminAttributeSchema);

/** DELETE /admin/attribute-values/{id} — delete an unused value; returns its attribute. */
export const deleteAttributeValueCSR = (valueId: number): Promise<AdminAttribute> =>
  parseResponse(http.delete(`${csrPrefixUrl}/admin/attribute-values/${valueId}`), AdminAttributeSchema);
