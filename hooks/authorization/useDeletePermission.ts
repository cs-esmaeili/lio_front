'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deletePermissionCSR } from '@/services/adminAuthorization.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

/** Owns `DELETE /admin/permissions/{id}`. */
export function useDeletePermission() {
  const [loading, setLoading] = useState(false);

  const deletePermission = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);

    try {
      await deletePermissionCSR(id);
      return true;
    } catch (error) {
      if (isApiError(error) && error.handled) return false;

      toast.error(getApiErrorMessage(error, 'خطا در حذف دسترسی. دوباره تلاش کنید.'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deletePermission, loading } as const;
}
