'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import ProductListItem from '@/components/dashboard/product/ProductListItem';
import PageHeader from '@/components/dashboard/PageHeader';
import Icon from '@/components/global/Icon';
import { Like } from 'iconsax-reactjs';
import Image from 'next/image';
import { useGetFavorites } from '@/hooks/favorites/useGetFavorites';
import { useRemoveFavorite } from '@/hooks/favorites/useRemoveFavorite';
import { PaginationGenerator } from '@/components/global/PaginationGenerator';
import { normalizePagination } from '@/utils/pagination';

export default function FavoritePage() {
  const pageInfo = { href: '/dashboard/favorite', label: 'علاقه‌مندی‌ها', icon: Like };
  const { favorites, loading, pagination, fetchFavorites, setFavorites } = useGetFavorites();
  const { removeFavorite } = useRemoveFavorite();
  const paginationInfo = normalizePagination(pagination);

  useEffect(() => {
    fetchFavorites(1);
  }, [fetchFavorites]);

  const handleRemove = async (productId: number): Promise<boolean> => {
    const product = favorites.find((f) => f.id === productId);
    if (!product) return false;
    const ok = await removeFavorite(product.barcode, productId);
    if (ok) {
      setFavorites((prev) => prev.filter((f) => f.id !== productId));
    }
    return ok;
  };

  return (
    <div className='flex h-full flex-col items-start gap-6 rounded-2xl border-2 border-gray-1 p-4'>
      <PageHeader
        titleSlot={
          <div className='inline-flex items-center gap-2 pb-1 pl-1 border-b border-primary-1'>
            <Icon
              IconComponent={pageInfo.icon}
              className='transition-colors duration-200 text-secondary-black-3'
              size={24}
              aria-hidden='true'
              variant='TwoTone'
              toneTwoColor='--color-primary-1'
            />
            <span className='text-regular text-secondary-1'>{pageInfo.label}</span>
          </div>
        }
      />

      {loading ? (
        <div className='flex h-full w-full min-h-64 flex-1 flex-col items-center justify-center py-12'>
          <div className='w-8 h-8 border-2 border-primary-1 border-t-transparent rounded-full animate-spin' />
        </div>
      ) : favorites.length === 0 ? (
        <div className='flex h-full w-full min-h-64 flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed border-primary-1 text-center'>
          <div className='w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 relative'>
            <Image src='/icons/empty-data.svg' alt='No favorites' fill className='object-contain' sizes='80px' />
          </div>
          <h6 className='text-gray-3 text-sm sm:text-base'>لیست علاقه‌مندی شما خالی است</h6>
        </div>
      ) : (
        <>
          <div className='flex flex-wrap w-full overflow-hidden'>
            {favorites.map((product) => (
              <div key={product.id} className='w-full sm:w-1/2 lg:w-1/3 px-0 min-w-0'>
                <div className='border border-gray-200 h-full overflow-hidden'>
                  <ProductListItem
                    id={product.id}
                    name={product.title}
                    image={product.image}
                    price={product.default_variant.final_amount}
                    originalPrice={
                      product.default_variant.amount !== product.default_variant.final_amount ? product.default_variant.amount : undefined
                    }
                    discountPercent={product.default_variant.discount_percent > 0 ? product.default_variant.discount_percent : undefined}
                    onRemove={handleRemove}
                    href={`/product/${product.barcode}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {paginationInfo.totalPages > 1 && (
            <div className='flex justify-center mt-6'>
              <Suspense fallback={null}>
                <PaginationGenerator pagination={paginationInfo} onChange={(page) => fetchFavorites(page)} />
              </Suspense>
            </div>
          )}
        </>
      )}
    </div>
  );
}
