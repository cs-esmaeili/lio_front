'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { listLocationsCSR } from '@/services/address.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

import type { Location } from '@/components/dashboard/address/address.model';

/**
 * Fetches the whole province/city list (`GET /locations`) and derives the
 * province names used by the address form. The API returns a flat list, so the
 * city options are filtered from the same array.
 *
 * `enabled` keeps the request lazy: the address form only needs the list while
 * it is open, so callers pass the modal's `open` state.
 */
export function useLocations(enabled = true) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (!enabled) return;

    fetchLocations();
  }, [enabled, fetchLocations]);

  const provinces = useMemo(
    () => Array.from(new Set(locations.map((location) => location.province))),
    [locations],
  );

  return { locations, provinces, loading, refetch: fetchLocations };
}
