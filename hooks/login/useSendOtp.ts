'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { sendOtpCSR } from '@/services/auth.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useSendOtp() {
  const [loading, setLoading] = useState(false);

  const sendOtp = async (username: string) => {
    setLoading(true);

    try {
      const response = await sendOtpCSR(username);
      return response.data;
    } catch (error: unknown) {
      // Interceptor already handled global errors (401, 403, 5xx, network) —
      // skip showing a second toast unless we want to override
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
