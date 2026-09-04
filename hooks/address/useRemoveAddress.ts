'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { removeAddressCSR } from '@/services/address.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

export function useRemoveAddress() {
  const [loading, setLoading] = useState(false);

  const removeAddress = async (address_id: number) => {
    setLoading(true);

    try {
      const res = await removeAddressCSR(address_id);
      return res.data;
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در حذف آدرس. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { removeAddress, loading };
}
