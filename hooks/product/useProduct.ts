'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getProductCSR } from '@/services/product.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminAvailableAttribute, AdminProduct } from '@/typescript/schemas/products/admin-product.schema';

/** Owns `GET /admin/products/{id}` — the product editor payload. */
export function useProduct(id: number | null) {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [availableAttributes, setAvailableAttributes] = useState<AdminAvailableAttribute[]>([]);
  const [loading, setLoading] = useState(id !== null);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<AdminProduct | null> => {
    if (id === null) return null;

    setLoading(true);
    setError(null);

    try {
      const result = await getProductCSR(id);
      setProduct(result.product);
      setAvailableAttributes(result.availableAttributes);
      return result.product;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }
      const message = getApiErrorMessage(requestError, 'خطا در دریافت محصول');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id === null) return;
    let active = true;

    void (async () => {
      try {
        const result = await getProductCSR(id);
        if (!active) return;
        setProduct(result.product);
        setAvailableAttributes(result.availableAttributes);
        setError(null);
      } catch (requestError) {
        if (!active) return;
        if (isApiError(requestError) && requestError.handled) {
          setError(requestError.message);
          return;
        }
        const message = getApiErrorMessage(requestError, 'خطا در دریافت محصول');
        setError(message);
        toast.error(message);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  return { product, availableAttributes, loading, error, refetch } as const;
}
