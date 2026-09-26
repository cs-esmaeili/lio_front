import type { AxiosResponse } from 'axios';
import http from '@/services/core/clientService';
import { fetcher } from '@/services/core/SSRService';
import { ApiError } from '@/utils/api-error';
import { CheckoutSchema, type Checkout } from '@/typescript/schemas/checkout.schema';
import type { OrderInvoiceResponse } from '@/typescript/types/checkout.types';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;
const ssrPrefixUrl = `${process.env.BACKEND_ENDPOINT_SSR}`;

/** Successful responses are wrapped in `{ statusCode, data, message }`. */
function unwrap(body: unknown): unknown {
  if (typeof body === 'object' && body !== null && 'data' in body) {
    return body.data;
  }
  return body;
}

/**
 * `GET /checkout` — the whole checkout page payload for the authenticated user.
 * Validation/transform happens here, at the service boundary.
 */
export const getCheckoutCSR = async (): Promise<Checkout> => {
  const response: AxiosResponse = await http.get(`${csrPrefixUrl}/checkout`);

  const parsed = CheckoutSchema.safeParse(unwrap(response.data));
  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', parsed.error);
  }

  return parsed.data;
};

////////////////////////////////////////////////////////////
// SSR - Order Invoice
////////////////////////////////////////////////////////////

export const orderInvoiceSSR = async (code: string, cookie?: string): Promise<OrderInvoiceResponse> => {
  const url = `${ssrPrefixUrl}/payment/order-invoice`;
  return fetcher<OrderInvoiceResponse>(url, {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: cookie ? { Cookie: cookie } : undefined,
  });
};
