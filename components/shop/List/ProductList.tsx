'use client';

import { useEffect, useState, useMemo } from 'react';
import SortTabs from '@/components/shop/List/SortTabs';
import ProductCard from '@/components/global/Cards/ProductCard';
import ProductCardHorizontal from '@/components/global/Cards/ProductCardHorizontal';
import { PaginationGenerator } from '@/components/global/PaginationGenerator';
import { useShopContext } from '@/providers/ShopProvider';
import styles from '@/styles/modules/borders/ProductListBorders.module.css';
import { Spinner } from '@/components/shadcn/spinner';

interface Props {
  products: any[];
  pagination: any;
  loading: boolean;
  setOpenFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductList = ({ products, pagination, loading, setOpenFilter }: Props) => {
  const [cardHorizontalMode, setCardHorizontalMode] = useState(false);
  const { liveParams, onUrlChange, sortOptions } = useShopContext();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1279) setCardHorizontalMode(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeSortId = liveParams.get('sort');

  const activeFilterCount = useMemo(() => {
    let count = 0;
    liveParams.forEach((_value, key) => {
      if (key === 'page' || key === 'sort' || key === 'page_number') return;
      count++;
    });
    return count;
  }, [liveParams]);

  return (
    <div className='flex flex-col xl:gap-20'>
      <SortTabs
        setCardHorizontalMode={setCardHorizontalMode}
        setOpenFilter={setOpenFilter}
        productCount={pagination?.total}
        activeSortId={activeSortId}
        activeFilterCount={activeFilterCount}
      />

      {loading ? (
        <div className='flex items-center justify-center min-h-100 mb-5'>
          <Spinner className='size-12 text-primary-1' />
        </div>
      ) : products.length === 0 ? (
        <div className='flex items-center justify-center min-h-100 mb-5'>
          <p className='text-neutral-500 text-lg'>محصولی یافت نشد</p>
        </div>
      ) : (
        <>
          <div
            className={
              cardHorizontalMode
                ? `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-5 ${styles.productListBorder}`
                : `grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-5 box-list ${styles.productListBorder}`
            }>
            {products.map((pro: any) =>
              cardHorizontalMode ? (
                <ProductCardHorizontal data={pro} key={pro.id} />
              ) : (
                <ProductCard data={pro} key={pro.id} showBorder />
              )
            )}
          </div>

          <PaginationGenerator
            pagination={pagination}
            onChange={(page) => {
              const next = new URLSearchParams(liveParams.toString());
              next.set('page', String(page));
              onUrlChange(next);
            }}
            autoUpdateUrl={false}
          />
        </>
      )}
    </div>
  );
};

export default ProductList;
