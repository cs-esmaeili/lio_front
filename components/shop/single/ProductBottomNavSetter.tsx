'use client';

import { useEffect } from 'react';
import { useProductBottomNavStore } from '@/stores/productBottomNavStore';
import type { ProductDetailsProduct } from '@/typescript/schemas/products/product-details.schema';

export default function ProductBottomNavSetter({ product }: { product: ProductDetailsProduct }) {
  useEffect(() => {
    useProductBottomNavStore.getState().setProductData({
      baseAttributes: [],
      prices: [],
      product,
    });

    return () => {
      useProductBottomNavStore.getState().clear();
    };
  }, [product]);

  return null;
}
