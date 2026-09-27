'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { updateSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { HeaderSectionSchema, type HeaderItemInput, type HeaderSection } from '@/typescript/schemas/page-section.schema';

/** Owns `PATCH /admin/page-sections/{id}/data` for a HEADER item (`id` required). */
export function useUpdateHeaderItem() {
  const [loading, setLoading] = useState(false);

  const updateHeaderItem = useCallback(
    async (sectionId: number, data: HeaderItemInput & { id: number }): Promise<HeaderSection | null> => {
      setLoading(true);

      try {
        return await updateSectionItemCSR(sectionId, { type: 'HEADER', data: { ...data } }, HeaderSectionSchema);
      } catch (error) {
        if (isApiError(error) && error.handled) return null;

        toast.error(getApiErrorMessage(error, 'خطا در ذخیره آیتم هدر. دوباره تلاش کنید.'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateHeaderItem, loading } as const;
}
