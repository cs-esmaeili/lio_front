'use client';

import { useState, useCallback } from 'react';
import { removeCart } from '@/services/cart.service';
import { getAuthToken } from '@/hooks/useAuth';

/**
 * Server-side cart-remove for authenticated users.
 * Sends { cart_ids: number[] }.
 * Does nothing (returns false) when user is not logged in.
 */
export function useRemoveCartApi() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (cart_ids: number[]): Promise<boolean> => {
    if (!!!getAuthToken()) return false;

    setLoading(true);
    try {
      await removeCart(cart_ids);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  return { removeCartApi: mutate, removeCartApiLoading: loading } as const;
}
