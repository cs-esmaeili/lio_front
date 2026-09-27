'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { updateUserStatusCSR } from '@/services/adminUsers.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminUser, UserStatus } from '@/typescript/schemas/admin-user.schema';

/** Owns `PATCH /admin/users/{id}/status`. */
export function useUpdateUserStatus() {
  const [loading, setLoading] = useState(false);

  const updateStatus = useCallback(async (id: number, status: UserStatus): Promise<AdminUser | null> => {
    setLoading(true);

    try {
      return await updateUserStatusCSR(id, status);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در تغییر وضعیت کاربر. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateStatus, loading } as const;
}
