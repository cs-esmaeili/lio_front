'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { brandsListCSR } from '@/services/brands.service';

export function useBrandSearch(liveParams: URLSearchParams, initialBrands: any, initialPagination: any) {
  const [brands, setBrands] = useState(initialBrands);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  const page = Number(liveParams.get('page')) || 1;

  const getBrands = async (targetPage: number) => {
    try {
      setLoading(true);
      const data = (await brandsListCSR(targetPage)).data.data;
      setBrands(data.brands);
      setPagination(data.links);
    } catch {
      toast.error('خطا در دریافت لیست برندها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    getBrands(page);
  }, [page]);

  return { brands, pagination, loading };
}
