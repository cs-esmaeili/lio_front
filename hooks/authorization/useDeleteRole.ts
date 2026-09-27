'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteRoleCSR } from '@/services/adminAuthorization.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

/** Owns `DELETE /admin/roles/{id}`. */
export function useDeleteRole() {
  const [loading, setLoading] = useState(false);

  const deleteRole = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);

    try {
      await deleteRoleCSR(id);
      return true;
    } catch (error) {
      if (isApiError(error) && error.handled) return false;

      toast.error(getApiErrorMessage(error, 'خطا در حذف نقش. دوباره تلاش کنید.'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteRole, loading } as const;
}
