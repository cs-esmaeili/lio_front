'use client';

import { useState, useCallback } from 'react';
import { updateCart } from '@/services/cart.service';
import { getAuthToken } from '@/hooks/useAuth';

/**
 * Server-side cart-update for authenticated users.
 * Sends { cart_id, quantity }.
 * Does nothing (returns false) when user is not logged in.
 */
export function useUpdateCartApi() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (cart_id: number, quantity: number): Promise<boolean> => {
    if (!!!getAuthToken()) return false;

    setLoading(true);
    try {
      await updateCart({ cart_id, quantity });
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateCartApi: mutate, updateCartApiLoading: loading } as const;
}
