'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { ContactSectionSchema, type ContactInput, type ContactSection } from '@/typescript/schemas/page-section.schema';

/** Owns `POST /admin/page-sections/{id}/data` for the CONTACT singleton. */
export function useCreateContact() {
  const [loading, setLoading] = useState(false);

  const createContact = useCallback(async (sectionId: number, data: ContactInput): Promise<ContactSection | null> => {
    setLoading(true);

    try {
      return await createSectionItemCSR(sectionId, { type: 'CONTACT', data: { ...data } }, ContactSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ساخت اطلاعات تماس. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createContact, loading } as const;
}
