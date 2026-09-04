'use client';

import { useEffect, useState } from 'react';
import { fetchCompareData } from './actions';
import { CompareTable } from './CompareTable';
import type { CompareData } from '@/hooks/useCompare';
import type { CompareProduct } from './types';
import { useCompareStore } from '@/stores/compareStore';

export default function ComparePage() {
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [storedCategory, setStoredCategory] = useState('');

  useEffect(() => {
    const stored = useCompareStore.getState().data;

    if (!stored || stored.products.length === 0) {
      setLoading(false);
      return;
    }

    setStoredCategory(stored.productCategory ?? '');

    fetchCompareData(stored.products).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleRemove = (barcode: string) => {
    useCompareStore.getState().remove(barcode);
    setProducts((prev) => prev.filter((p) => p.product.barcode !== barcode));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6" dir="rtl">
        <h1 className="mb-6 text-center text-xl font-bold">مقایسه محصول</h1>
        <div className="flex items-center justify-center py-16">
          <p className="text-neutral-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6" dir="rtl">
        <h1 className="mb-6 text-center text-xl font-bold">مقایسه محصول</h1>
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border py-16 text-neutral-500">
          <p className="text-lg">هیچ محصولی برای مقایسه انتخاب نشده است</p>
          <p className="text-sm">از صفحه محصولات، کالاهای مورد نظر را به مقایسه اضافه کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      <h1 className="mb-6 text-center text-xl font-bold">مقایسه محصول</h1>
      <CompareTable
        products={products}
        storedCategory={storedCategory}
        onRemove={handleRemove}
      />
    </div>
  );
}
