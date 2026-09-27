'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { HeaderSectionSchema, type HeaderSection } from '@/typescript/schemas/page-section.schema';

/** Owns `DELETE /admin/page-sections/{id}/data?itemId=` for a HEADER item. */
export function useDeleteHeaderItem() {
  const [loading, setLoading] = useState(false);

  const deleteHeaderItem = useCallback(async (sectionId: number, itemId: number): Promise<HeaderSection | null> => {
    setLoading(true);

    try {
      return await deleteSectionItemCSR(sectionId, itemId, HeaderSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در حذف آیتم هدر. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteHeaderItem, loading } as const;
}
