'use client';

import { useLiveSearchParams } from '@/hooks/useShallowUrl';
import { useBrandSearch } from '@/hooks/shop/useBrandSearch';
import CategoryCard from '@/components/global/Cards/CategoryCard';
import { PaginationGenerator } from '@/components/global/PaginationGenerator';
import { normalizePagination } from '@/utils/pagination';
import { Spinner } from '@/components/shadcn/spinner';

interface BrandsPaginationProps {
  initialBrands: any[];
  initialPagination: {
    current_page: number;
    last_page: number;
  };
}

export function BrandsPagination({ initialBrands, initialPagination }: BrandsPaginationProps) {
  const liveParams = useLiveSearchParams();
  const { brands, pagination, loading } = useBrandSearch(liveParams, initialBrands, initialPagination);
  const paginationInfo = normalizePagination(pagination);


  return (
    <>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Spinner className="size-8 text-primary-2" />
          </div>
        )}

        <div className='grid grid-cols-4 md:grid-cols-8 gap-x-6 gap-y-2 my-5'>
          {(brands ?? []).map((brand: { id: number; image: string; slug: string; title: string }) => (
            <div key={brand.id}>
              <CategoryCard id={brand.id} image={brand.image} link={`/brands/${brand.slug}`} title={brand.title} />
            </div>
          ))}
        </div>
      </div>

      {paginationInfo.totalPages > 1 && <PaginationGenerator pagination={paginationInfo} autoUpdateUrl={true} />}
    </>
  );
}
