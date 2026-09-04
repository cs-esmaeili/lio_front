'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { personalInfo } from '@/services/dashboard.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function usePersonalInfo() {
  const [personal, setPersonal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      setLoading(true);

      try {
        const response = await personalInfo();
        setPersonal(response.data.data);
      } catch (error: unknown) {
      
        if (isApiError(error) && error.handled) {
          return;
        }

        const message = getApiErrorMessage(
          error,
          'در دریافت اطلاعات کاربر خطایی به وجود آمد',
        );

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  return {
    personal,
    loading,
  };
}