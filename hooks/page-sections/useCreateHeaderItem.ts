'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { HeaderSectionSchema, type HeaderItemInput, type HeaderSection } from '@/typescript/schemas/page-section.schema';

/** Owns `POST /admin/page-sections/{id}/data` for a HEADER item. */
export function useCreateHeaderItem() {
  const [loading, setLoading] = useState(false);

  const createHeaderItem = useCallback(async (sectionId: number, data: HeaderItemInput): Promise<HeaderSection | null> => {
    setLoading(true);

    try {
      return await createSectionItemCSR(sectionId, { type: 'HEADER', data: { ...data } }, HeaderSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ساخت آیتم هدر. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createHeaderItem, loading } as const;
}
