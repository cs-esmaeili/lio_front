import { ApiError } from '@/utils/api-error';
import {
  CartSchema,
  CartEnvelopeSchema,
  CartErrorBodySchema,
  type Cart,
} from '@/typescript/schemas/cart.schema';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT ?? '';
const GUEST_TOKEN_KEY = 'cart_token';

/* -------------------------------------------------------------------------- */
/*  Cookies + guest identity                                                  */
/* -------------------------------------------------------------------------- */

/** Read a cookie value at request time. Never cache — `csrf_token` rotates. */
function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfBootstrap: Promise<void> | null = null;

/**
 * `GET /auth/csrf` must run for every visitor (guests included) before the
 * first mutation. Deduped while in flight.
 */
export function bootstrapCsrf(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!csrfBootstrap) {
    csrfBootstrap = fetch(`${API_BASE}/auth/csrf`, { credentials: 'include' })
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        csrfBootstrap = null;
      });
  }
  return csrfBootstrap;
}

export function readGuestToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(GUEST_TOKEN_KEY);
}

/** Create the guest `X-Cart-Token` once and keep it stable in localStorage. */
export function ensureGuestToken(): string {
  if (typeof window === 'undefined') return '';
  const existing = readGuestToken();
  if (existing) return existing;
  const token = crypto.randomUUID();
  window.localStorage.setItem(GUEST_TOKEN_KEY, token);
  return token;
}

export function clearGuestToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(GUEST_TOKEN_KEY);
}

/** Logout flow: the old guest token is stale, start a fresh guest identity. */
export function rotateGuestToken(): string {
  clearGuestToken();
  return ensureGuestToken();
}

/* -------------------------------------------------------------------------- */
/*  Request client                                                            */
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

async function cartRequest(path: string, init: RequestInit = {}): Promise<Cart> {
  const method = (init.method ?? 'GET').toUpperCase();
  const headers = new Headers(init.headers);

  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');

  // CSRF double-submit: read the cookie fresh on every mutation.
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    let csrf = readCookie('csrf_token');
    if (!csrf) {
      await bootstrapCsrf();
      csrf = readCookie('csrf_token');
    }
    if (csrf) headers.set('X-CSRF-Token', csrf);
  }

  // Guests identify with X-Cart-Token; logged-in users with the auth cookie.
  const guestToken = method === 'GET' ? readGuestToken() : (readGuestToken() ?? ensureGuestToken());
  if (guestToken) headers.set('X-Cart-Token', guestToken);

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    method,
    headers,
    credentials: 'include',
  });

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

/* -------------------------------------------------------------------------- */
/*  Endpoints                                                                 */
/* -------------------------------------------------------------------------- */

export const getCart = (): Promise<Cart> => cartRequest('/cart');

export const addCartItem = (variantId: number, quantity = 1): Promise<Cart> =>
  cartRequest('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ variantId, quantity }),
  });

export const updateCartItem = (variantId: number, quantity: number): Promise<Cart> =>
  cartRequest(`/cart/items/${variantId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });

export const removeCartItem = (variantId: number): Promise<Cart> =>
  cartRequest(`/cart/items/${variantId}`, { method: 'DELETE' });
