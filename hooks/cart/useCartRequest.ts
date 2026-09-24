'use client';

import { useCallback } from 'react';
import { ApiError, isApiError } from '@/utils/api-error';
import { useCsrf } from '@/hooks/useCsrf';
import { useGuestCartToken } from '@/hooks/cart/useGuestCartToken';
import {
  getCartCSR,
  addCartItemCSR,
  updateCartItemCSR,
  removeCartItemCSR,
} from '@/services/cart.service';
import {
  CartSchema,
  CartEnvelopeSchema,
  CartErrorBodySchema,
  type Cart,
} from '@/typescript/schemas/cart.schema';

/* -------------------------------------------------------------------------- */
/*  Response handling                                                         */
/* -------------------------------------------------------------------------- */

function extractMessage(body: unknown): string {
  const parsed = CartErrorBodySchema.safeParse(body);
  if (parsed.success) {
    if (parsed.data.message) return parsed.data.message;
    if (parsed.data.details?.length) {
      return parsed.data.details.map((detail) => detail.message).join('، ');
    }
  }
  return 'درخواست با خطا مواجه شد';
}

/** Successful responses are wrapped in `{ statusCode, data, message }`. */
async function parseCartResponse(res: Response): Promise<Cart> {
  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, extractMessage(body), body);
  }

  const envelope = CartEnvelopeSchema.safeParse(body);
  if (!envelope.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', envelope.error);
  }

  const parsed = CartSchema.safeParse(envelope.data.data);
  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', parsed.error);
  }

  return parsed.data;
}

/** Backend rejects a mutation with this when it sees neither auth nor X-Cart-Token. */
function isGuestTokenRequired(error: unknown): boolean {
  return isApiError(error) && error.status === 400 && /X-Cart-Token/i.test(error.message);
}

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Builds cart requests: CSRF header (fresh on every mutation) + guest token,
 * then parses the `{ statusCode, data, message }` envelope into a `Cart`.
 */
export function useCartRequest() {
  const { ensureCsrfToken } = useCsrf();
  const { readGuestToken, ensureGuestToken, rotateGuestToken } = useGuestCartToken();

  const buildHeaders = useCallback(
    async (method: string): Promise<Headers> => {
      const headers = new Headers({ Accept: 'application/json' });
      const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(method);

      if (isMutation) {
        headers.set('Content-Type', 'application/json');
        const csrf = await ensureCsrfToken();
        if (csrf) headers.set('X-CSRF-Token', csrf);
      }

      const guestToken = isMutation ? (readGuestToken() ?? ensureGuestToken()) : readGuestToken();
      if (guestToken) headers.set('X-Cart-Token', guestToken);

      return headers;
    },
    [ensureCsrfToken, readGuestToken, ensureGuestToken],
  );

  const request = useCallback(
    async (method: string, send: (headers: Headers) => Promise<Response>): Promise<Cart> => {
      const headers = await buildHeaders(method);
      return parseCartResponse(await send(headers));
    },
    [buildHeaders],
  );

  /** A mutation drops the session silently when the auth token expired. */
  const sendMutation = useCallback(
    async (send: (headers: Headers) => Promise<Response>): Promise<Cart> => {
      try {
        return await request('POST', send);
      } catch (error) {
        if (!isGuestTokenRequired(error)) throw error;
        rotateGuestToken();
        return request('POST', send);
      }
    },
    [request, rotateGuestToken],
  );

  const getCart = useCallback(
    (): Promise<Cart> => request('GET', (headers) => getCartCSR(headers)),
    [request],
  );

  const addCartItem = useCallback(
    (variantId: number, quantity: number): Promise<Cart> =>
      sendMutation((headers) => addCartItemCSR(variantId, quantity, headers)),
    [sendMutation],
  );

  const updateCartItem = useCallback(
    (variantId: number, quantity: number): Promise<Cart> =>
      sendMutation((headers) => updateCartItemCSR(variantId, quantity, headers)),
    [sendMutation],
  );

  const removeCartItem = useCallback(
    (variantId: number): Promise<Cart> =>
      sendMutation((headers) => removeCartItemCSR(variantId, headers)),
    [sendMutation],
  );

  return { getCart, addCartItem, updateCartItem, removeCartItem } as const;
}
