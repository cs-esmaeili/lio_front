'use client';

import { useCallback } from 'react';

const GUEST_TOKEN_KEY = 'cart_token';

function read(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(GUEST_TOKEN_KEY);
}

function ensure(): string {
  if (typeof window === 'undefined') return '';
  const existing = read();
  if (existing) return existing;
  const token = crypto.randomUUID();
  window.localStorage.setItem(GUEST_TOKEN_KEY, token);
  return token;
}

function clear(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(GUEST_TOKEN_KEY);
}

/**
 * Owns the guest cart identity: the UUID the frontend creates and sends as
 * `X-Cart-Token` so a not-logged-in visitor has a server-side cart.
 */
export function useGuestCartToken() {
  const readGuestToken = useCallback((): string | null => read(), []);
  const ensureGuestToken = useCallback((): string => ensure(), []);
  const clearGuestToken = useCallback((): void => clear(), []);

  /** Logout flow: the old token is stale, start a fresh guest identity. */
  const rotateGuestToken = useCallback((): string => {
    clear();
    return ensure();
  }, []);

  return { readGuestToken, ensureGuestToken, clearGuestToken, rotateGuestToken } as const;
}
