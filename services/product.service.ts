import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';
import {
  AdminProductListResponseSchema,
  AdminProductOkSchema,
  AdminProductSchema,
  AvailableAttributesResponseSchema,
  GetAdminProductResponseSchema,
  type AdminAvailableAttribute,
  type AdminProduct,
  type AdminProductListResponse,
  type SaveProductPayload,
} from '@/typescript/schemas/products/admin-product.schema';

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
/*  Products — /admin/products                                                */
/* -------------------------------------------------------------------------- */

export interface ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
}

/** GET /admin/products — paginated list (requires `product:read`). */
export const listProductsCSR = (query: ProductListQuery = {}): Promise<AdminProductListResponse> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/products`, { params: query }), AdminProductListResponseSchema);

/** GET /admin/products/{id} — product editor payload. */
export const getProductCSR = (id: number): Promise<{ product: AdminProduct; availableAttributes: AdminAvailableAttribute[] }> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/products/${id}`), GetAdminProductResponseSchema);

/** GET /admin/products/available-attributes — attributes exposed by the given categories. */
export const getAvailableAttributesCSR = (categoryIds: number[]): Promise<AdminAvailableAttribute[]> => {
  const query = categoryIds.length > 0 ? `?categoryIds=${categoryIds.join(',')}` : '';
  return parseResponse(http.get(`${csrPrefixUrl}/admin/products/available-attributes${query}`), AvailableAttributesResponseSchema).then(
    (result) => result.attributes,
  );
};

/** POST /admin/products — create a product with its images, attributes and variants. */
export const createProductCSR = (payload: SaveProductPayload): Promise<AdminProduct> =>
  parseResponse(http.post(`${csrPrefixUrl}/admin/products`, payload), AdminProductSchema);

/** PATCH /admin/products/{id} — update a product (full editor payload). */
export const updateProductCSR = (id: number, payload: SaveProductPayload): Promise<AdminProduct> =>
  parseResponse(http.patch(`${csrPrefixUrl}/admin/products/${id}`, payload), AdminProductSchema);

/** DELETE /admin/products/{id} — delete a product. */
export const deleteProductCSR = (id: number): Promise<{ ok: boolean }> =>
  parseResponse(http.delete(`${csrPrefixUrl}/admin/products/${id}`), AdminProductOkSchema);
