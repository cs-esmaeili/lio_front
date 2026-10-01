'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { ContactSectionSchema, type ContactSection } from '@/typescript/schemas/page-section.schema';

/** Owns `DELETE /admin/page-sections/{id}/data` for the CONTACT singleton. */
export function useDeleteContact() {
  const [loading, setLoading] = useState(false);

  const deleteContact = useCallback(async (sectionId: number): Promise<ContactSection | null> => {
    setLoading(true);

    try {
      return await deleteSectionItemCSR(sectionId, undefined, ContactSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در حذف اطلاعات تماس. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteContact, loading } as const;
}
