'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { updateSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { BannerSectionSchema, type BannerSection, type BannerItemInput } from '@/typescript/schemas/page-section.schema';

/** Owns `PATCH /admin/page-sections/{id}/data` for a BANNER item (`id` required). */
export function useUpdateBanner() {
  const [loading, setLoading] = useState(false);

  const updateBanner = useCallback(
    async (sectionId: number, data: BannerItemInput & { id: number }): Promise<BannerSection | null> => {
      setLoading(true);

      try {
        return await updateSectionItemCSR(sectionId, { type: 'BANNER', data: { ...data } }, BannerSectionSchema);
      } catch (error) {
        if (isApiError(error) && error.handled) return null;

        toast.error(getApiErrorMessage(error, 'خطا در ذخیره بنر. دوباره تلاش کنید.'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateBanner, loading } as const;
}
