'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteCategoryCSR } from '@/services/category.service';
import { categoryStore } from '@/stores/categoryStore';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

/** Owns `DELETE /admin/categories/{id}` — deletes a leaf category and drops it from the store. */
export function useDeleteCategory() {
  const [loading, setLoading] = useState(false);

  const deleteCategory = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);

    try {
      await deleteCategoryCSR(id);
      categoryStore.getState().removeCategories([id]);
      return true;
    } catch (error) {
      if (isApiError(error) && error.handled) return false;
      if (isApiError(error) && error.status === 409) {
        toast.error('این دسته‌بندی زیردسته دارد؛ ابتدا زیردسته‌ها را حذف یا جابه‌جا کنید.');
        return false;
      }

      toast.error(getApiErrorMessage(error, 'خطا در حذف دسته‌بندی. دوباره تلاش کنید.'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteCategory, loading } as const;
}
