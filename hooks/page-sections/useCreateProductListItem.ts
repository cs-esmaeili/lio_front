'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { ProductListSectionSchema, type ProductListItemInput, type ProductListSection } from '@/typescript/schemas/page-section.schema';

/** Owns `POST /admin/page-sections/{id}/data` for a PRODUCT_LIST item. */
export function useCreateProductListItem() {
  const [loading, setLoading] = useState(false);

  const createProductItem = useCallback(async (sectionId: number, data: ProductListItemInput): Promise<ProductListSection | null> => {
    setLoading(true);

    try {
      return await createSectionItemCSR(sectionId, { type: 'PRODUCT_LIST', data: { ...data } }, ProductListSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در افزودن محصول. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createProductItem, loading } as const;
}
