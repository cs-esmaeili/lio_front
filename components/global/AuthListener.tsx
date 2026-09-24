'use client';

import { useEffect } from 'react';
import { useCart } from '@/hooks/cart/useCart';

/**
 * Listens for auth:logout events (dispatched by the axios interceptor on 401)
 * and clears client-side state that depends on authentication.
 *
 * Mounted once in the root layout — never unmounts, never renders anything.
 */
export function AuthListener() {
  const { resetAfterLogout } = useCart();

  useEffect(() => {
    const handleLogout = () => {
      resetAfterLogout();
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [resetAfterLogout]);

  return null;
}
