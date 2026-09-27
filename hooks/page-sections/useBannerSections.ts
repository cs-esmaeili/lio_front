'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getPageSectionsCSR } from '@/services/pageSections.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import { BannerSectionSchema, HomeSectionsPageSchema, type BannerSection } from '@/typescript/schemas/page-section.schema';

/**
 * Owns the read of every BANNER section on the home page
 * (`GET /page-sections/page?entityType=HOME`, filtered by type).
 */
export function useBannerSections(enabled = true) {
  const [sections, setSections] = useState<BannerSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = useCallback(async (): Promise<BannerSection[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const page = await getPageSectionsCSR('HOME', HomeSectionsPageSchema);
      const bannerSections = page.sections
        .filter((section) => section.type === 'BANNER')
        .flatMap((section) => {
          const parsed = BannerSectionSchema.safeParse(section);
          return parsed.success ? [parsed.data] : [];
        });

      setSections(bannerSections);
      return bannerSections;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }

      const message = getApiErrorMessage(requestError, 'خطا در دریافت بنرها');
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
