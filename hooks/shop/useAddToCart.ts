'use client';

import { useState, useCallback } from 'react';
import { addToCart } from '@/services/cart.service';
import { getAuthToken } from '@/hooks/useAuth';

export interface AddToCartApiResult {
  cart_items: Array<{
    cart_id: number;
    product: { product_price_id: number };
  }>;
  cart: {
    items_count: number;
    base_price: number;
    final_price: number;
    currency_symbol: string;
    discount: number;
    discount_percent: number;
    payment_price: number;
  };
}

/**
 * Server-side add-to-cart for authenticated users.
 * Sends { product_id, variant_id } → returns cart_id from response.
 * Does NOT touch local store — caller handles that.
 * Returns null when user is not logged in.
 */
export function useAddToCartApi() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (product_id: number, variant_id: number): Promise<number | null> => {
    if (!!!getAuthToken()) return null;

    setLoading(true);
    try {
      const res = await addToCart({ product_id, variant_id });
      const data: AddToCartApiResult = res.data.data;

      const cartItem = data.cart_items?.find(
        (ci) => ci.product.product_price_id === variant_id
      );

      return cartItem?.cart_id ?? null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addToCartApi: mutate, addToCartApiLoading: loading } as const;
}
