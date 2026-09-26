'use client';

import { useEffect } from 'react';
import { useCart } from '@/hooks/cart/useCart';
import { useAuth } from '@/hooks/auth/useAuth';
import { authStore } from '@/stores/authStore';

/**
 * Resolves the session once on mount (`GET /auth/me`) and listens for
 * `auth:logout` events (dispatched by the axios interceptor on 401 and by
 * `useAuth().logout`) to clear auth state and everything that depends on it.
 *
 * Mounted once in the root layout — never unmounts, never renders anything.
 */
export function AuthListener() {
  const { resetAfterLogout } = useCart();
  const { refresh } = useAuth();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const handleLogout = () => {
      authStore.getState().clear();
      resetAfterLogout();
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [resetAfterLogout]);

  return null;
}
