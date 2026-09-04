'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { sigaretobesazSearchCSR } from '@/services/sigaretobesaz.service';
import { buildAttributesQuery, SigaretobesazSearchParams } from '@/utils/sigaretobesaz/buildAttributesQuery';
import { SigaretobesazSearchResponseSchema } from '@/typescript/schemas/products/sigaretobesaz.schema';
import { getApiErrorMessage } from '@/utils/api-error';

/**
 * Manual (non-URL-synced) product search for the sigaretobesaz page.
 * Nothing is fetched until `search()` is explicitly called — e.g. from the
 * "جستجو" button — matching the requirement that the page shows no products
 * until the user actively searches.
 */
export function useSigaretobesazSearch() {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const reqRef = useRef(0);
  const lastParamsRef = useRef<SigaretobesazSearchParams>({ attributes: [], madeIran: null, priceFrom: null, priceTo: null });

  const search = async (params: SigaretobesazSearchParams, page = 1) => {
    lastParamsRef.current = params;
    const id = ++reqRef.current;

    setLoading(true);
    setHasSearched(true);

    try {
      const query = buildAttributesQuery(params, page);
      const response = await sigaretobesazSearchCSR(query);

      if (id !== reqRef.current) return; // a newer search started, drop this result

      const parsed = SigaretobesazSearchResponseSchema.safeParse(response.data);

      if (parsed.success) {
        setProducts(parsed.data.products);
        setPagination(parsed.data.product_pagination);
      } else {
        // Fall back to the raw payload so a schema mismatch never blocks the UI
        setProducts(response.data?.products ?? []);
        setPagination(response.data?.product_pagination ?? null);
      }
    } catch (error) {
      if (id === reqRef.current) {
        toast.error(getApiErrorMessage(error, 'خطا در دریافت محصولات'));
      }
    } finally {
      if (id === reqRef.current) setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    search(lastParamsRef.current, page);
  };

  const reset = () => {
    reqRef.current += 1; // invalidate any in-flight request
    setProducts([]);
    setPagination(null);
    setHasSearched(false);
    setLoading(false);
  };

  return { products, pagination, loading, hasSearched, search, goToPage, reset };
}