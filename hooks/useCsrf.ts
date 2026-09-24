'use client';

import { useCallback } from 'react';
import { getCsrfTokenCSR } from '@/services/csrf.service';

/** Read a cookie at request time. Never cache — `csrf_token` rotates. */
function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfBootstrap: Promise<void> | null = null;

/**
 * Owns the CSRF double-submit token:
 * - bootstraps the `csrf_token` cookie once per visitor (guests included),
 * - reads it fresh on every mutation, because it rotates on
 *   login / refresh / logout.
 */
export function useCsrf() {
  const bootstrapCsrf = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    if (!csrfBootstrap) {
      csrfBootstrap = getCsrfTokenCSR()
        .then(() => undefined)
        .catch(() => undefined)
        .finally(() => {
          csrfBootstrap = null;
        });
    }
    return csrfBootstrap;
  }, []);

  const getCsrfToken = useCallback((): string | null => readCookie('csrf_token'), []);

  const ensureCsrfToken = useCallback(async (): Promise<string | null> => {
    const existing = readCookie('csrf_token');
    if (existing) return existing;
    await bootstrapCsrf();
    return readCookie('csrf_token');
  }, [bootstrapCsrf]);

  return { bootstrapCsrf, getCsrfToken, ensureCsrfToken } as const;
}
