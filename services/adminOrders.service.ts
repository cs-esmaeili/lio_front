import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';
import { AdminOrdersListSchema, OrderSchema, type AdminOrdersList, type Order, type OrderStatus } from '@/typescript/schemas/order.schema';

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
/*  Admin orders — /admin/orders (requires `order:read`)                       */
/* -------------------------------------------------------------------------- */

export interface AdminOrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  userId?: number;
}

/** GET /admin/orders — every order, paginated and filterable. */
export const listOrdersCSR = (query: AdminOrdersQuery = {}): Promise<AdminOrdersList> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/orders`, { params: query }), AdminOrdersListSchema);

/** GET /admin/orders/{id} — a single order regardless of its owner. */
export const getOrderCSR = (id: number): Promise<Order> =>
  parseResponse(http.get(`${csrPrefixUrl}/admin/orders/${id}`), OrderSchema);

/* -------------------------------------------------------------------------- */
/*  Fulfilment — PATCH /admin/orders/{id}/ship|complete (requires `order:manage`) */
/* -------------------------------------------------------------------------- */

/** Successful mutation envelope: `{ ok: true }`. */
const OkSchema = z.object({ ok: z.boolean().catch(true) });

/** PATCH /admin/orders/{id}/ship — mark a paid order shipped with a tracking code. */
export const shipOrderCSR = (id: number, trackingCode: string): Promise<{ ok: boolean }> =>
  parseResponse(http.patch(`${csrPrefixUrl}/admin/orders/${id}/ship`, { trackingCode }), OkSchema);

/** PATCH /admin/orders/{id}/complete — mark a shipped order completed. */
export const completeOrderCSR = (id: number): Promise<{ ok: boolean }> =>
  parseResponse(http.patch(`${csrPrefixUrl}/admin/orders/${id}/complete`, {}), OkSchema);
