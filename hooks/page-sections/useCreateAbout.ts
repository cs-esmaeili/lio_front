'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { AboutSectionSchema, type AboutInput, type AboutSection } from '@/typescript/schemas/page-section.schema';

/** Owns `POST /admin/page-sections/{id}/data` for the ABOUT singleton. */
export function useCreateAbout() {
  const [loading, setLoading] = useState(false);

  const createAbout = useCallback(async (sectionId: number, data: AboutInput): Promise<AboutSection | null> => {
    setLoading(true);

    try {
      return await createSectionItemCSR(sectionId, { type: 'ABOUT', data: { ...data } }, AboutSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ساخت بخش درباره ما. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createAbout, loading } as const;
}
