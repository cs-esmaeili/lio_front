'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { IntroductionSectionSchema, type IntroductionSection } from '@/typescript/schemas/page-section.schema';

/** Owns `DELETE /admin/page-sections/{id}/data` for the INTRODUCTION singleton. */
export function useDeleteIntroduction() {
  const [loading, setLoading] = useState(false);

  const deleteIntroduction = useCallback(async (sectionId: number): Promise<IntroductionSection | null> => {
    setLoading(true);

    try {
      return await deleteSectionItemCSR(sectionId, undefined, IntroductionSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در حذف بخش معرفی. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteIntroduction, loading } as const;
}
