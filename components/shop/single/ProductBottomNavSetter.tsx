'use client';

import { useEffect } from 'react';
import { useProductBottomNavStore } from '@/stores/productBottomNavStore';

type Props = {
  baseAttributes: any;
  prices: any;
  product: any;
};

export default function ProductBottomNavSetter({ baseAttributes, prices, product }: Props) {
  useEffect(() => {
    useProductBottomNavStore.getState().setProductData({
      baseAttributes,
      prices,
      product,
    });

    return () => {
      useProductBottomNavStore.getState().clear();
    };
  }, [baseAttributes, prices, product]);

  return null;
}
