'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { FooterSectionSchema, type FooterItemInput, type FooterSection } from '@/typescript/schemas/page-section.schema';

/** Owns `POST /admin/page-sections/{id}/data` for a FOOTER item. */
export function useCreateFooterItem() {
  const [loading, setLoading] = useState(false);

  const createFooterItem = useCallback(async (sectionId: number, data: FooterItemInput): Promise<FooterSection | null> => {
    setLoading(true);

    try {
      return await createSectionItemCSR(sectionId, { type: 'FOOTER', data: { ...data } }, FooterSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ساخت آیتم فوتر. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createFooterItem, loading } as const;
}
