'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { updateCategoryCSR, type CategoryPayload } from '@/services/category.service';
import { categoryStore } from '@/stores/categoryStore';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminCategory } from '@/typescript/schemas/category.schema';

/** Owns `PATCH /admin/categories/{id}` — updates a category and refreshes the shared store. */
export function useUpdateCategory() {
  const [loading, setLoading] = useState(false);

  const updateCategory = useCallback(
    async (id: number, payload: Partial<CategoryPayload>): Promise<AdminCategory | null> => {
      setLoading(true);

      try {
        const updated = await updateCategoryCSR(id, payload);
        categoryStore.getState().upsertCategory(updated);
        return updated;
      } catch (error) {
        if (isApiError(error) && error.handled) return null;
        if (isApiError(error) && error.status === 409) {
          toast.error('این اسلاگ قبلاً استفاده شده است. اسلاگ دیگری انتخاب کنید.');
          return null;
        }

        toast.error(getApiErrorMessage(error, 'خطا در ذخیره دسته‌بندی. دوباره تلاش کنید.'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateCategory, loading } as const;
}
