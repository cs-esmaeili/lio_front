'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { SliderSectionSchema, type SliderSection } from '@/typescript/schemas/page-section.schema';

/** Owns `DELETE /admin/page-sections/{id}/data?itemId=` for a SLIDER item. */
export function useDeleteSliderSlide() {
  const [loading, setLoading] = useState(false);

  const deleteSlide = useCallback(async (sectionId: number, itemId: number): Promise<SliderSection | null> => {
    setLoading(true);

    try {
      return await deleteSectionItemCSR(sectionId, itemId, SliderSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در حذف اسلاید. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteSlide, loading } as const;
}
