'use client';

import { useEffect } from 'react';
import { cartStore } from '@/stores/cartStore';
import { rotateGuestToken } from '@/services/cart.service';

/**
 * Listens for auth:logout events (dispatched by the axios interceptor on 401)
 * and clears client-side state that depends on authentication.
 *
 * Mounted once in the root layout — never unmounts, never renders anything.
 */
export function AuthListener() {
  useEffect(() => {
    const handleLogout = () => {
      // Cart is server-side now; drop stale state and start a fresh guest identity.
      cartStore.getState().reset();
      rotateGuestToken();
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  return null;
}
