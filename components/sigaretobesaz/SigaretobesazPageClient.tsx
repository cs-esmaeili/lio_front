'use client';

import Image from 'next/image';
import Gradient from '@/components/global/Gradient';
import sigaretobesaz from '@/public/global/sigaretobesaz.png';
import SigaretobesazTopFilters from '@/components/sigaretobesaz/SigaretobesazTopFilters';
import SigaretobesazProductList from '@/components/sigaretobesaz/SigaretobesazProductList';
import { useSigaretobesazSearch } from '@/hooks/sigaretobesaz/useSigaretobesazSearch';

export default function SigaretobesazPageClient() {
  const {
    products,
    pagination,
    loading,
    hasSearched,
    search,
    goToPage,
    reset,
  } = useSigaretobesazSearch();

  return (
    <>
      <Gradient />

      <section className="container overflow-x-hidden">
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <Image src={sigaretobesaz} alt="sigaretobesaz" />
          <h1 className="text-center text-secondary-1">
            انتخاب با تو، پیشنهاد سیگار با دودیگرام
          </h1>

          <p className="text-secondary-1 max-w-2xl text-center text-body leading-relaxed mt-3">
            ویژگی‌های موردنظرت رو انتخاب کن تا دودیگرام با یک پیشنهاد هوشمند،
            مناسب‌ترین سیگارها رو بر اساس سلیقه‌ات نمایش بده.
          </p>
        </div>

        <div className="flex flex-col gap-8 mb-8 overflow-x-hidden">
          <SigaretobesazTopFilters
            onSearch={(params) => search(params, 1)}
            onReset={reset}
          />

          <SigaretobesazProductList
            products={products}
            pagination={pagination}
            loading={loading}
            hasSearched={hasSearched}
            onPageChange={goToPage}
          />
        </div>
      </section>
    </>
  );
}