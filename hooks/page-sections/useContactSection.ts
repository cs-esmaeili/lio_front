'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getSectionByLocationCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { ContactSectionSchema, type ContactSection } from '@/typescript/schemas/page-section.schema';

/** Owns the read of the global CONTACT section (`GET /page-sections/section?location=CONTACT`). */
export function useContactSection(enabled = true) {
  const [section, setSection] = useState<ContactSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSection = useCallback(async (): Promise<ContactSection | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await getSectionByLocationCSR('CONTACT', ContactSectionSchema);
      setSection(result);
      return result;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت بخش تماس با ما');
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
