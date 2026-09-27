'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { updateSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { SliderSectionSchema, type SliderSection, type SliderSlideInput } from '@/typescript/schemas/page-section.schema';

/** Owns `PATCH /admin/page-sections/{id}/data` for a SLIDER item (`id` required). */
export function useUpdateSliderSlide() {
  const [loading, setLoading] = useState(false);

  const updateSlide = useCallback(
    async (sectionId: number, data: SliderSlideInput & { id: number }): Promise<SliderSection | null> => {
      setLoading(true);

      try {
        return await updateSectionItemCSR(sectionId, { type: 'SLIDER', data: { ...data } }, SliderSectionSchema);
      } catch (error) {
        if (isApiError(error) && error.handled) return null;

        toast.error(getApiErrorMessage(error, 'خطا در ذخیره اسلاید. دوباره تلاش کنید.'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateSlide, loading } as const;
}
