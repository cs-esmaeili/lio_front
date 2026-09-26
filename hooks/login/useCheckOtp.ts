'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthRequest } from '@/hooks/auth/useAuthRequest';
import { authStore } from '@/stores/authStore';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useCheckOtp() {
  const [loading, setLoading] = useState(false);
  const { verifyOtp } = useAuthRequest();

  const checkOtp = async (username: string, code: string) => {
    setLoading(true);

    try {
      const user = await verifyOtp(username, code);
      authStore.getState().setUser(user);
      return user;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }

      const message = getApiErrorMessage(
        error,
        'کد وارد شده صحیح نیست. دوباره تلاش کنید.',
      );

      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkOtp, loading };
}
