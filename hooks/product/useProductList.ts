'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { listProductsCSR, type ProductListQuery } from '@/services/product.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminProductListResponse } from '@/typescript/schemas/products/admin-product.schema';

const EMPTY_RESPONSE: AdminProductListResponse = { items: [], page: 1, limit: 20, total: 0, totalPages: 1 };

/** Owns `GET /admin/products` — refetches whenever the query changes. */
export function useProductList(query: ProductListQuery) {
  const [data, setData] = useState<AdminProductListResponse>(EMPTY_RESPONSE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page, limit, search, categoryId } = query;

  const refetch = useCallback(async (): Promise<AdminProductListResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await listProductsCSR({ page, limit, search, categoryId });
      setData(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }
      const message = getApiErrorMessage(requestError, 'خطا در دریافت محصولات');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, categoryId]);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const result = await listProductsCSR({ page, limit, search, categoryId });
        if (!active) return;
        setData(result);
        setError(null);
      } catch (requestError) {
        if (!active) return;
        if (isApiError(requestError) && requestError.handled) {
          setError(requestError.message);
          return;
        }
        const message = getApiErrorMessage(requestError, 'خطا در دریافت محصولات');
        setError(message);
        toast.error(message);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [page, limit, search, categoryId]);

  return { data, loading, error, refetch } as const;
}
