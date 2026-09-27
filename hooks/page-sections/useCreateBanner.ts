'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { BannerSectionSchema, type BannerSection, type BannerItemInput } from '@/typescript/schemas/page-section.schema';

/** Owns `POST /admin/page-sections/{id}/data` for a BANNER item. */
export function useCreateBanner() {
  const [loading, setLoading] = useState(false);

  const createBanner = useCallback(async (sectionId: number, data: BannerItemInput): Promise<BannerSection | null> => {
    setLoading(true);

    try {
      return await createSectionItemCSR(sectionId, { type: 'BANNER', data: { ...data } }, BannerSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ساخت بنر. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createBanner, loading } as const;
}
