'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { updateSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { ProductListSectionSchema, type ProductListItemInput, type ProductListSection } from '@/typescript/schemas/page-section.schema';

/** Owns `PATCH /admin/page-sections/{id}/data` for a PRODUCT_LIST item (`id` required). */
export function useUpdateProductListItem() {
  const [loading, setLoading] = useState(false);

  const updateProductItem = useCallback(
    async (sectionId: number, data: ProductListItemInput & { id: number }): Promise<ProductListSection | null> => {
      setLoading(true);

      try {
        return await updateSectionItemCSR(sectionId, { type: 'PRODUCT_LIST', data: { ...data } }, ProductListSectionSchema);
      } catch (error) {
        if (isApiError(error) && error.handled) return null;

        toast.error(getApiErrorMessage(error, 'خطا در ذخیره محصول. دوباره تلاش کنید.'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateProductItem, loading } as const;
}
