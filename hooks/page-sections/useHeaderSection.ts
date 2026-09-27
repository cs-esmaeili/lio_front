'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getSectionByLocationCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { HeaderSectionSchema, type HeaderSection } from '@/typescript/schemas/page-section.schema';

/** Owns the read of the global HEADER section (`GET /page-sections/section?location=HEADER`). */
export function useHeaderSection(enabled = true) {
  const [section, setSection] = useState<HeaderSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSection = useCallback(async (): Promise<HeaderSection | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await getSectionByLocationCSR('HEADER', HeaderSectionSchema);
      setSection(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت هدر');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void fetchSection();
  }, [enabled, fetchSection]);

  return { section, loading, error, refetch: fetchSection } as const;
}
