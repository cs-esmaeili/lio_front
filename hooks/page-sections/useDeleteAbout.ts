'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { AboutSectionSchema, type AboutSection } from '@/typescript/schemas/page-section.schema';

/** Owns `DELETE /admin/page-sections/{id}/data` for the ABOUT singleton. */
export function useDeleteAbout() {
  const [loading, setLoading] = useState(false);

  const deleteAbout = useCallback(async (sectionId: number): Promise<AboutSection | null> => {
    setLoading(true);

    try {
      return await deleteSectionItemCSR(sectionId, undefined, AboutSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در حذف بخش درباره ما. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteAbout, loading } as const;
}
