'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { listLocationsCSR } from '@/services/address.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

import type { Location } from '@/components/dashboard/address/address.model';

/**
 * Fetches the whole province/city list once (`GET /locations`) and derives the
 * province names used by the address form. The API returns a flat list, so the
 * city options are filtered from the same array.
 */
export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = useCallback(async () => {
    setLoading(true);

    try {
      const list = await listLocationsCSR();
      setLocations(list);
      return list;
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در دریافت لیست استان‌ها و شهرها'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const provinces = useMemo(
    () => Array.from(new Set(locations.map((location) => location.province))),
    [locations],
  );

  return { locations, provinces, loading, refetch: fetchLocations };
}
