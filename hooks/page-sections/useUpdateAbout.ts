'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { updateSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { AboutSectionSchema, type AboutInput, type AboutSection } from '@/typescript/schemas/page-section.schema';

/** Owns `PATCH /admin/page-sections/{id}/data` for the ABOUT singleton. */
export function useUpdateAbout() {
  const [loading, setLoading] = useState(false);

  const updateAbout = useCallback(async (sectionId: number, data: AboutInput): Promise<AboutSection | null> => {
    setLoading(true);

    try {
      return await updateSectionItemCSR(sectionId, { type: 'ABOUT', data: { ...data } }, AboutSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ذخیره بخش درباره ما. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateAbout, loading } as const;
}
