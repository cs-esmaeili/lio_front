'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getProvincesCSR, type PlaceItem } from '@/services/address.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

export function useProvinces() {
  const [provinces, setProvinces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProvinces = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getProvincesCSR();
      const list = res.data?.data ?? [];
      setProvinces(list);
      return list;
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در دریافت لیست استان‌ها'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  return { provinces, loading, refetch: fetchProvinces };
}
