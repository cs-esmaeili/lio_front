"use client";

import { useCompareStore, type CompareData } from '@/stores/compareStore';
import { toast } from 'sonner';

export type { CompareData };

export function useCompare(productId: string, productCategory: string) {
  const isCompared = useCompareStore((s) => s.has(productId));
  const data = useCompareStore((s) => s.data);

  const toggle = () => {
    const result = useCompareStore.getState().toggle(productId, productCategory);

    if (result.added) {
      toast.success('محصول به لیست مقایسه اضافه شد');
    } else if (result.reason === 'max_items') {
      toast.warning('حداکثر ۴ محصول برای مقایسه مجاز است');
    }
  };

  return {
    isCompared,
    toggle,
    products: data?.products ?? [],
    category: data?.productCategory ?? null,
  };
}
