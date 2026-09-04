'use client';

import { useState, useEffect, useRef } from 'react';
import { searchCSR as shopSearchCSR } from '@/services/shop.service';
import { searchCSR as categorySearchCSR } from '@/services/category.service';
import { brandsShopListCSR } from '@/services/brands.service';

export function useProductSearch(
  liveParams: URLSearchParams,
  type: 'shop' | 'category' | 'brand',
  categorySlug: string | null,
  initialProducts: any,
  initialPagination: any
) {
  const [products, setProducts] = useState(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const reqRef = useRef(0);
  const mountedRef = useRef(false);

  const paramsKey = liveParams.toString();
  const ctxKey = type === 'category' ? `${type}:${categorySlug}` : type;

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    let cancelled = false;
    const id = ++reqRef.current;
    const query = paramsKey;

    setLoading(true);

    let promise;

    switch (type) {
      case 'category':
        promise = categorySearchCSR(categorySlug!, query);
        break;

      case 'shop':
        promise = shopSearchCSR(query);
        break;

      case 'brand':
        promise = brandsShopListCSR(categorySlug!, query);
        break;
    }

    promise
      .then((response) => {
        if (!cancelled && id === reqRef.current) {
          setProducts(response.data.products);
          setPagination(response.data.product_pagination);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled && id === reqRef.current) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, ctxKey]);

  return { products, pagination, loading };
}
