'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteSectionItemCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { ProductListSectionSchema, type ProductListSection } from '@/typescript/schemas/page-section.schema';

/** Owns `DELETE /admin/page-sections/{id}/data?itemId=` for a PRODUCT_LIST item. */
export function useDeleteProductListItem() {
  const [loading, setLoading] = useState(false);

  const deleteProductItem = useCallback(async (sectionId: number, itemId: number): Promise<ProductListSection | null> => {
    setLoading(true);

    try {
      return await deleteSectionItemCSR(sectionId, itemId, ProductListSectionSchema);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در حذف محصول. دوباره تلاش کنید.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteProductItem, loading } as const;
}
