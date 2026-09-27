'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { BannerSectionSchema, type BannerSection } from '@/typescript/schemas/page-section.schema';

/** Owns `DELETE /admin/page-sections/{id}/data?itemId=` for a BANNER item. */
export function useDeleteBanner() {
  const [loading, setLoading] = useState(false);

  const deleteBanner = useCallback(async (sectionId: number, itemId: number): Promise<BannerSection | null> => {
    setLoading(true);

    try {
      return await deleteSectionItemCSR(sectionId, itemId, BannerSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در حذف بنر. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteBanner, loading } as const;
}
