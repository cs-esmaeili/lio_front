'use client';

import { useState, useCallback } from 'react';
import { addToCartMany } from '@/services/cart.service';
import { toast } from 'sonner';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

type CartItemInput = {
  variant_id: number;
  product_id: number;
  quantity: number;
};

/**
 * Bulk add-to-cart for syncing guest localStorage cart to server after login.
 * Sends array of { variant_id, product_id, quantity } to POST /cart/add-cart.
 */
export function useAddToCartMany() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (items: CartItemInput[]): Promise<boolean> => {
    if (!items.length) return false;

    setLoading(true);
    try {
      await addToCartMany(items);
      return true;
    } catch (error: unknown) {
      if (!isApiError(error) || !error.handled) {
        toast.error(getApiErrorMessage(error, 'خطا در همگام‌سازی سبد خرید'));
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addToCartManyApi: mutate, loading } as const;
}
