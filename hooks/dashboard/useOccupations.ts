'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getOccupations, type Occupation } from '@/services/profile.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

interface UseOccupationsReturn {
  occupations: Occupation[];
  loading: boolean;
}

export function useOccupations(): UseOccupationsReturn {
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOccupations = async () => {
      setLoading(true);
      try {
        const res = await getOccupations();
        setOccupations(res.data.data ?? []);
      } catch (error: unknown) {
        if (isApiError(error) && error.handled) return;
        toast.error(
          getApiErrorMessage(error, 'دریافت لیست مشاغل با خطا مواجه شد'),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOccupations();
  }, []);

  return { occupations, loading };
}
