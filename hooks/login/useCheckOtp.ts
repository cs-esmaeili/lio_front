'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { checkOtpCSR } from '@/services/auth.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useCheckOtp() {
  const [loading, setLoading] = useState(false);

  const checkOtp = async (username: string, code: string) => {
    setLoading(true);

    try {
      const response = await checkOtpCSR(username, code);
      const data = response.data;

      if (!data?.accessToken) {
        toast.error('پاسخ غیرمنتظره از سرور. لطفا دوباره تلاش کنید.');
        return null;
      }

      return data;
    } catch (error: unknown) {
      // Interceptor already handled global errors (401, 403, 5xx, network) —
      // skip showing a second toast unless we want to override
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
