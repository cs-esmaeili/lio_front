'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { editAddressCSR, type AddressEditPayload } from '@/services/address.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

import type { Address } from '@/components/dashboard/address/address.model';

export function useEditAddress() {
  const [loading, setLoading] = useState(false);

  const editAddress = async (payload: AddressEditPayload): Promise<Address | null> => {
    setLoading(true);

    try {
      return await editAddressCSR(payload);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ویرایش آدرس. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { editAddress, loading };
}
