'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getAvailableAttributesCSR } from '@/services/product.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminAvailableAttribute } from '@/typescript/schemas/products/admin-product.schema';

const EMPTY: AdminAvailableAttribute[] = [];

/** Owns `GET /admin/products/available-attributes?categoryIds=...`. */
export function useAvailableAttributes(categoryIds: number[]) {
  const [attributes, setAttributes] = useState<AdminAvailableAttribute[]>(EMPTY);
  const [loadedKey, setLoadedKey] = useState('');
  const [loading, setLoading] = useState(categoryIds.length > 0);
  const key = categoryIds.join(',');

  const refetch = useCallback(async (): Promise<AdminAvailableAttribute[] | null> => {
    if (!key) return EMPTY;

    setLoading(true);
    try {
      const ids = key.split(',').map(Number);
      const result = await getAvailableAttributesCSR(ids);
      setAttributes(result);
      setLoadedKey(key);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) return null;
      toast.error(getApiErrorMessage(requestError, 'خطا در دریافت ویژگی‌های دسته‌بندی'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    if (!key) return;
    let active = true;
    const ids = key.split(',').map(Number);

    void (async () => {
      try {
        const result = await getAvailableAttributesCSR(ids);
        if (!active) return;
        setAttributes(result);
        setLoadedKey(key);
      } catch (requestError) {
        if (!active) return;
        if (isApiError(requestError) && requestError.handled) return;
        toast.error(getApiErrorMessage(requestError, 'خطا در دریافت ویژگی‌های دسته‌بندی'));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [key]);

  return { attributes: key ? attributes : EMPTY, loadedKey, loading, refetch } as const;
}
