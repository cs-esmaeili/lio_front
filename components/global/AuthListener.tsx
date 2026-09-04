'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';

/**
 * Listens for auth:logout events (dispatched by the axios interceptor on 401)
 * and clears client-side state that depends on authentication.
 *
 * Mounted once in the root layout — never unmounts, never renders anything.
 */
export function AuthListener() {
  useEffect(() => {
    const handleLogout = () => {
      // Clear cart store — server is the source of truth for auth users,
      // and localStorage data is now stale since the session is gone.
      useCartStore.getState().clearCart();
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  return null;
}
