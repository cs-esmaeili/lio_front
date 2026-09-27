'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { updateRoleCSR, type RolePayload } from '@/services/adminAuthorization.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminRole } from '@/typescript/schemas/admin-authorization.schema';

/** Owns `PATCH /admin/roles/{id}`. */
export function useUpdateRole() {
  const [loading, setLoading] = useState(false);

  const updateRole = useCallback(async (id: number, payload: Partial<RolePayload>): Promise<AdminRole | null> => {
    setLoading(true);

    try {
      return await updateRoleCSR(id, payload);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ذخیره نقش. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateRole, loading } as const;
}
