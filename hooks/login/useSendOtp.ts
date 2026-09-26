'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthRequest } from '@/hooks/auth/useAuthRequest';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useSendOtp() {
  const [loading, setLoading] = useState(false);
  const { requestOtp } = useAuthRequest();

  const sendOtp = async (username: string) => {
    setLoading(true);

    try {
      return await requestOtp(username);
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }

      const message = getApiErrorMessage(
        error,
        'خطا در ارسال کد تایید. دوباره تلاش کنید.',
      );

      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, loading };
}
