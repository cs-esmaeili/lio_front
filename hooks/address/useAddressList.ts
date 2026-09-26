'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { listAddressesCSR } from '@/services/address.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

import type { Address } from '@/components/dashboard/address/address.model';

export function useAddressList() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async (): Promise<Address[] | null> => {
    setLoading(true);

    try {
      const list = await listAddressesCSR();
      setAddresses(list);
      return list;
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در دریافت لیست آدرس‌ها'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return { addresses, loading, refetch: fetchAddresses };
}
