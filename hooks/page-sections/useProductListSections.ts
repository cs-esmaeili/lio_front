'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getPageSectionsCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { HomeSectionsPageSchema, ProductListSectionSchema, type ProductListSection } from '@/typescript/schemas/page-section.schema';

/**
 * Owns the read of every PRODUCT_LIST section on the home page
 * (`GET /page-sections/page?entityType=HOME`, filtered by type).
 */
export function useProductListSections(enabled = true) {
  const [sections, setSections] = useState<ProductListSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = useCallback(async (): Promise<ProductListSection[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const page = await getPageSectionsCSR('HOME', HomeSectionsPageSchema);
      const productSections = page.sections
        .filter((section) => section.type === 'PRODUCT_LIST')
        .flatMap((section) => {
          const parsed = ProductListSectionSchema.safeParse(section);
          return parsed.success ? [parsed.data] : [];
        });

      setSections(productSections);
      return productSections;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت لیست محصولات');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void fetchSections();
  }, [enabled, fetchSections]);

  return { sections, loading, error, refetch: fetchSections } as const;
}
