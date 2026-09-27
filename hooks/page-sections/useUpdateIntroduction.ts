'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { updateSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { IntroductionSectionSchema, type IntroductionInput, type IntroductionSection } from '@/typescript/schemas/page-section.schema';

/** Owns `PATCH /admin/page-sections/{id}/data` for the INTRODUCTION singleton. */
export function useUpdateIntroduction() {
  const [loading, setLoading] = useState(false);

  const updateIntroduction = useCallback(async (sectionId: number, data: IntroductionInput): Promise<IntroductionSection | null> => {
    setLoading(true);

    try {
      return await updateSectionItemCSR(sectionId, { type: 'INTRODUCTION', data: { ...data } }, IntroductionSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ذخیره بخش معرفی. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateIntroduction, loading } as const;
}
