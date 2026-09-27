'use client';

import { useCallback, useEffect } from 'react';
import { useStore } from 'zustand';
import { toast } from 'sonner';

import { listCategoriesCSR } from '@/services/category.service';
import { categoryStore } from '@/stores/categoryStore';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminCategory } from '@/typescript/schemas/category.schema';

interface UseCategoryListOptions {
  /** Skip the initial fetch (e.g. while a dialog is closed). Defaults to `true`. */
  enabled?: boolean;
}

/**
 * Owns `GET /admin/categories`. The result is cached in `categoryStore`, so the
 * admin page and every `CategoryPickerDialog` share one fetch. Pass
 * `enabled: false` to keep the request lazy until the consumer is visible.
 */
export function useCategoryList({ enabled = true }: UseCategoryListOptions = {}) {
  const categories = useStore(categoryStore, (state) => state.categories);
  const status = useStore(categoryStore, (state) => state.status);
  const error = useStore(categoryStore, (state) => state.error);

  const refetch = useCallback(async (): Promise<AdminCategory[] | null> => {
    categoryStore.getState().setLoading();

    try {
      const list = await listCategoriesCSR();
      categoryStore.getState().setCategories(list);
      return list;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        categoryStore.getState().setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت دسته‌بندی‌ها');
      categoryStore.getState().setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // Only fetch when we have nothing yet — mutations keep the store fresh.
    if (categoryStore.getState().status === 'idle') void refetch();
  }, [enabled, refetch]);

  return { categories, loading: status === 'loading', error, refetch } as const;
}
