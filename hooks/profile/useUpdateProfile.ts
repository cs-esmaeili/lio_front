'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { updateProfileCSR } from '@/services/profile.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

import {
  ProfileErrorSchema,
  type Profile,
  type ProfileFieldError,
  type UpdateProfileInput,
} from '@/typescript/schemas/profile.schema';

/** Updates the current user's own profile (`PATCH /profile`). */
export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<ProfileFieldError | null>(null);

  const update = async (payload: UpdateProfileInput): Promise<Profile | null> => {
    setLoading(true);
    setFieldError(null);

    try {
      return await updateProfileCSR(payload);
    } catch (error) {
      if (isApiError(error)) {
        // 409 — the national code already belongs to another user.
        if (error.status === 409) {
          setFieldError({ field: 'nationalCode', message: 'این کد ملی قبلاً استفاده شده است' });
          return null;
        }

        // 400 — field-level validation details from the server.
        if (error.status === 400) {
          const parsed = ProfileErrorSchema.safeParse(error.data);
          const nationalCodeMessage = parsed.success
            ? parsed.data.details?.find((detail) => detail.field === 'nationalCode')?.message
            : undefined;

          if (nationalCodeMessage) {
            setFieldError({ field: 'nationalCode', message: nationalCodeMessage });
            return null;
          }
        }

        if (error.handled) return null;
      }

      toast.error(getApiErrorMessage(error, 'خطا در ذخیره تغییرات'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, fieldError } as const;
}
