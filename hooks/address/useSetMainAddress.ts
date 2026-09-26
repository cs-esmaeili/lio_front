'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { setMainAddressCSR } from '@/services/address.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

export function useSetMainAddress() {
  const [loading, setLoading] = useState(false);

  const setMainAddress = async (address_id: number) => {
    setLoading(true);

    try {
      return await setMainAddressCSR(address_id);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در تعیین آدرس پیش‌فرض. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { setMainAddress, loading };
}
