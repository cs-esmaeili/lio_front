'use client';

import { useState, useEffect, useRef } from 'react';
import { searchCSR as shopSearchCSR } from '@/services/shop.service';
import { productSearchCSR } from '@/services/category.service';
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

    const runSearch = async (): Promise<{ products: unknown[]; product_pagination: unknown }> => {
      switch (type) {
        case 'category':
          return productSearchCSR(categorySlug!, query);

        case 'shop': {
          const response = await shopSearchCSR(query);
          return { products: response.data.products, product_pagination: response.data.product_pagination };
        }

        case 'brand': {
          const response = await brandsShopListCSR(categorySlug!, query);
          return { products: response.data.products, product_pagination: response.data.product_pagination };
        }
      }
    };

    runSearch()
      .then((result) => {
        if (!cancelled && id === reqRef.current) {
          setProducts(result.products);
          setPagination(result.product_pagination);
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
