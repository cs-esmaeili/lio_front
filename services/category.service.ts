import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';
import {
  AdminCategoryListResponseSchema,
  AdminCategorySchema,
  CategoryOkSchema,
  type AdminCategory,
} from '@/typescript/schemas/category.schema';

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
/*  Categories — /admin/categories                                            */
/* -------------------------------------------------------------------------- */

/** Body shared by create/update. `null` clears the parent/image, omission leaves it unchanged. */
export interface CategoryPayload {
  name: string;
  slug: string;
  parentId?: number | null;
  imageId?: number | null;
}

/** GET /admin/categories — every category as a flat list (requires `category:read`). */
export const listCategoriesCSR = (): Promise<AdminCategory[]> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/categories`), AdminCategoryListResponseSchema).then(
    (result) => result.categories,
  );

/** GET /admin/categories/{id} — a single category. */
export const getCategoryCSR = (id: number): Promise<AdminCategory> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/categories/${id}`), AdminCategorySchema);

/** POST /admin/categories — create a category. */
export const createCategoryCSR = (payload: CategoryPayload): Promise<AdminCategory> =>
  parseResponse(http.post(`${csrPrefixUrl}/admin/categories`, payload), AdminCategorySchema);

/** PATCH /admin/categories/{id} — update a category. */
export const updateCategoryCSR = (id: number, payload: Partial<CategoryPayload>): Promise<AdminCategory> =>
  parseResponse(http.patch(`${csrPrefixUrl}/admin/categories/${id}`, payload), AdminCategorySchema);

/** DELETE /admin/categories/{id} — delete a leaf category. */
export const deleteCategoryCSR = (id: number): Promise<{ ok: boolean }> =>
  parseResponse(http.delete(`${csrPrefixUrl}/admin/categories/${id}`), CategoryOkSchema);
