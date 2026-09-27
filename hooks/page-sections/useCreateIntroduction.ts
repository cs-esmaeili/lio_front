'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { IntroductionSectionSchema, type IntroductionInput, type IntroductionSection } from '@/typescript/schemas/page-section.schema';

/** Owns `POST /admin/page-sections/{id}/data` for the INTRODUCTION singleton. */
export function useCreateIntroduction() {
  const [loading, setLoading] = useState(false);

  const createIntroduction = useCallback(async (sectionId: number, data: IntroductionInput): Promise<IntroductionSection | null> => {
    setLoading(true);

    try {
      return await createSectionItemCSR(sectionId, { type: 'INTRODUCTION', data: { ...data } }, IntroductionSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ساخت بخش معرفی. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createIntroduction, loading } as const;
}
