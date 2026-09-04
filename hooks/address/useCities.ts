'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getCitiesCSR, type PlaceItem } from '@/services/address.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

export function useCities(provinceId: number | undefined) {
  const [cities, setCities] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provinceId || provinceId <= 0) {
      setCities([]);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);

      try {
        const res = await getCitiesCSR(provinceId);
        if (!cancelled) setCities(res.data?.data ?? []);
      } catch (error) {
        if (isApiError(error) && error.handled) return;

        toast.error(getApiErrorMessage(error, 'خطا در دریافت لیست شهرها'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [provinceId]);

  return { cities, loading };
}
