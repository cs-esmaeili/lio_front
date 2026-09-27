'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { assignUserRoleCSR } from '@/services/adminUsers.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

/** Owns `PATCH /admin/users/{userId}/role`. */
export function useAssignUserRole() {
  const [loading, setLoading] = useState(false);

  const assignRole = useCallback(async (userId: number, roleId: number | null): Promise<boolean> => {
    setLoading(true);

    try {
      await assignUserRoleCSR(userId, roleId);
      return true;
    } catch (error) {
      if (isApiError(error) && error.handled) return false;

      toast.error(getApiErrorMessage(error, 'خطا در تخصیص نقش. دوباره تلاش کنید.'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { assignRole, loading } as const;
}
