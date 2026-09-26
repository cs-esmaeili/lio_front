'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { addAddressCSR, type AddressAddPayload } from '@/services/address.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

import type { Address } from '@/components/dashboard/address/address.model';

export function useAddAddress() {
  const [loading, setLoading] = useState(false);

  const addAddress = async (payload: AddressAddPayload): Promise<Address | null> => {
    setLoading(true);

    try {
      return await addAddressCSR(payload);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ذخیره آدرس. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addAddress, loading };
}
