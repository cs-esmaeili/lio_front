'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createRoleCSR, type RolePayload } from '@/services/adminAuthorization.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminRole } from '@/typescript/schemas/admin-authorization.schema';

/** Owns `POST /admin/roles`. */
export function useCreateRole() {
  const [loading, setLoading] = useState(false);

  const createRole = useCallback(async (payload: RolePayload): Promise<AdminRole | null> => {
    setLoading(true);

    try {
      return await createRoleCSR(payload);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ساخت نقش. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createRole, loading } as const;
}
