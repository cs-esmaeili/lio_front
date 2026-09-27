'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createCategoryCSR, type CategoryPayload } from '@/services/category.service';
import { categoryStore } from '@/stores/categoryStore';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminCategory } from '@/typescript/schemas/category.schema';

/** Owns `POST /admin/categories` — creates a category and updates the shared store. */
export function useCreateCategory() {
  const [loading, setLoading] = useState(false);

  const createCategory = useCallback(async (payload: CategoryPayload): Promise<AdminCategory | null> => {
    setLoading(true);

    try {
      const created = await createCategoryCSR(payload);
      categoryStore.getState().upsertCategory(created);
      return created;
    } catch (error) {
      if (isApiError(error) && error.handled) return null;
      if (isApiError(error) && error.status === 409) {
        toast.error('این اسلاگ قبلاً استفاده شده است. اسلاگ دیگری انتخاب کنید.');
        return null;
      }

      toast.error(getApiErrorMessage(error, 'خطا در ایجاد دسته‌بندی. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createCategory, loading } as const;
}
