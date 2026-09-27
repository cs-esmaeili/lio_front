'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getCategoryCSR } from '@/services/category.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminCategory } from '@/typescript/schemas/category.schema';

/** Owns `GET /admin/categories/{id}` — a single category. */
export function useCategory(id: number | null, enabled = true) {
  const [category, setCategory] = useState<AdminCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async (): Promise<AdminCategory | null> => {
    if (id === null) {
      setCategory(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getCategoryCSR(id);
      setCategory(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت دسته‌بندی');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!enabled) return;
    void fetchCategory();
  }, [enabled, fetchCategory]);

  return { category, loading, error, refetch: fetchCategory } as const;
}
