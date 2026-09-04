'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import {
  updateProfile,
  type UpdateProfilePayload,
} from '@/services/profile.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';


interface UseUpdateProfileReturn {
  loading: boolean;
  update: (data: UpdateProfilePayload) => Promise<boolean>;
}

export function useUpdateProfile(): UseUpdateProfileReturn {
  const [loading, setLoading] = useState(false);

  const update = async (
    data: UpdateProfilePayload,
  ): Promise<boolean> => {
    setLoading(true);

    try {
      await updateProfile(data);

      toast.success('تغییرات با موفقیت ذخیره شد');

      return true;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return false;
      }

      // Server validation errors (422)
      if (isApiError(error) && error.status === 422 && error.data) {
        const serverData = error.data as Record<string, unknown>;
        const errors = serverData?.errors as
          | Record<string, string[]>
          | undefined;

        if (errors) {
          const firstError = Object.values(errors).flat()[0];

          toast.error(
            firstError || 'لطفا اطلاعات وارد شده را بررسی کنید',
          );

          return false;
        }
      }

      toast.error(
        getApiErrorMessage(error, 'در ذخیره تغییرات خطایی رخ داد'),
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, update };
}