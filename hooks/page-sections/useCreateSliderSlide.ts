'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { SliderSectionSchema, type SliderSection, type SliderSlideInput } from '@/typescript/schemas/page-section.schema';

/** Owns `POST /admin/page-sections/{id}/data` for a SLIDER item. */
export function useCreateSliderSlide() {
  const [loading, setLoading] = useState(false);

  const createSlide = useCallback(async (sectionId: number, data: SliderSlideInput): Promise<SliderSection | null> => {
    setLoading(true);

    try {
      return await createSectionItemCSR(sectionId, { type: 'SLIDER', data: { ...data } }, SliderSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ساخت اسلاید. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createSlide, loading } as const;
}
