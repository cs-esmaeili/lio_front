'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthRequest } from '@/hooks/auth/useAuthRequest';
import { authStore } from '@/stores/authStore';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function usePasswordLogin() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthRequest();

  const loginWithPassword = async (username: string, password: string) => {
    setLoading(true);

    try {
      const user = await login(username, password);
      authStore.getState().setUser(user);
      return user;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }

      const message = getApiErrorMessage(
        error,
        'شماره موبایل یا رمز عبور صحیح نیست.',
      );

      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loginWithPassword, loading };
}
