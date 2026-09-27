'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { updateSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { FooterSectionSchema, type FooterItemInput, type FooterSection } from '@/typescript/schemas/page-section.schema';

/** Owns `PATCH /admin/page-sections/{id}/data` for a FOOTER item (`id` required). */
export function useUpdateFooterItem() {
  const [loading, setLoading] = useState(false);

  const updateFooterItem = useCallback(
    async (sectionId: number, data: FooterItemInput & { id: number }): Promise<FooterSection | null> => {
      setLoading(true);

      try {
        return await updateSectionItemCSR(sectionId, { type: 'FOOTER', data: { ...data } }, FooterSectionSchema);
      } catch (error) {
        if (isApiError(error) && error.handled) return null;

        toast.error(getApiErrorMessage(error, 'خطا در ذخیره آیتم فوتر. دوباره تلاش کنید.'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateFooterItem, loading } as const;
}
