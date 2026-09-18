'use client';

import ProductCard from '@/components/global/Cards/ProductCard';
import { PaginationGenerator } from '@/components/global/PaginationGenerator';
import { normalizePagination } from '@/utils/pagination';
import { Spinner } from '@/components/shadcn/spinner';

interface Props {
  products: any[];
  pagination: any;
  loading: boolean;
  hasSearched: boolean;
  onPageChange: (page: number) => void;
}

export default function SigaretobesazProductList({ products, pagination, loading, hasSearched, onPageChange }: Props) {
  const paginationInfo = normalizePagination(pagination);

  // Nothing has been searched yet — show nothing but a hint, per requirement.
  if (!hasSearched) {
    return (
        <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-2xl text-center p-12 w-full h-64">
          <p className="text-gray-500">هنوز انتخابی نداشتی</p>
        </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100 mb-5">
        <Spinner className="size-12 text-primary-1" />
      </div>
    );
  }

  if (!products.length) {
    return (
        <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-2xl text-center p-12 w-full h-64">
          <p className="text-gray-500">محصولی یافت نشد</p>
        </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mb-5">
        {products.map((pro: any) => (
          <ProductCard key={pro.id} data={pro} />
        ))}
      </div>

      {paginationInfo.totalPages > 1 && (
        <PaginationGenerator pagination={paginationInfo} onChange={onPageChange} autoUpdateUrl={false} />
      )}
    </div>
  );
}