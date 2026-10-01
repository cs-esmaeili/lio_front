'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { updateSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { ContactSectionSchema, type ContactInput, type ContactSection } from '@/typescript/schemas/page-section.schema';

/** Owns `PATCH /admin/page-sections/{id}/data` for the CONTACT singleton. */
export function useUpdateContact() {
  const [loading, setLoading] = useState(false);

  const updateContact = useCallback(async (sectionId: number, data: ContactInput): Promise<ContactSection | null> => {
    setLoading(true);

    try {
      return await updateSectionItemCSR(sectionId, { type: 'CONTACT', data: { ...data } }, ContactSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در ذخیره اطلاعات تماس. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateContact, loading } as const;
}
