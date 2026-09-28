import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import http from '@/services/core/clientService';
import { ApiError } from '@/utils/api-error';
import { MyOrderSummarySchema, MyOrdersListSchema, OrderSchema, type MyOrderSummary, type MyOrdersList, type Order, type OrderStatus } from '@/typescript/schemas/order.schema';

const csrPrefixUrl = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT!;

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
/*  Customer orders — /profile/orders                                         */
/* -------------------------------------------------------------------------- */

export interface MyOrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}

/** GET /profile/orders — the authenticated user's orders (scoped server-side). */
export const listMyOrdersCSR = (query: MyOrdersQuery = {}): Promise<MyOrdersList> =>
  parseResponse(http.get(`${csrPrefixUrl}/profile/orders`, { params: query }), MyOrdersListSchema);

/** GET /profile/orders/{orderNumber} — one of the authenticated user's orders. */
export const getMyOrderCSR = (orderNumber: string | number): Promise<Order> =>
  parseResponse(http.get(`${csrPrefixUrl}/profile/orders/${encodeURIComponent(String(orderNumber))}`), OrderSchema);

/** GET /profile/orders/summary — order counts per status for the dashboard. */
export const getMyOrderSummaryCSR = (): Promise<MyOrderSummary> =>
  parseResponse(http.get(`${csrPrefixUrl}/profile/orders/summary`), MyOrderSummarySchema);

/* -------------------------------------------------------------------------- */
/*  Back-compat helpers                                                       */
/* -------------------------------------------------------------------------- */

/** Every order of the current user (used by the ticket form order picker). */
export const ordersListAll = (): Promise<MyOrdersList> => listMyOrdersCSR();

/** Search the current user's orders by order number (tracking page). */
export const orderByQ = (code: string | number): Promise<MyOrdersList> => listMyOrdersCSR({ search: String(code), limit: 20 });
