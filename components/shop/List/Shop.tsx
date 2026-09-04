'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { BreadCrumpGenerator } from '@/components/global/BreadCrumpGenerator';
import Filters from '@/components/shop/List/Filters';
import ProductList from '@/components/shop/List/ProductList';
import LeftCard from '@/components/Home/HeroSection/LeftCard';
import AstelamCard from '@/components/global/Cards/AstelamCard';
import EditorSection from '@/components/shop/List/EditorSection';
import FiltersMobile from '@/components/shop/List/FiltersMobile';
import DoodiContact from '@/components/global/Cards/DoodiContact';
import { ShopProvider } from '@/providers/ShopProvider';
import { useLiveSearchParams, shallowReplace } from '@/hooks/useShallowUrl';
import { useProductSearch } from '@/hooks/shop/useProductSearch';

type Props = {
  pageInfo: any;
  serverFilters: any;
  type: 'shop' | 'category' | 'brand';
  categorySlug: string | null;
  callToAction?: any;
  socialToAction?: any;
};

const Shop = ({ pageInfo, serverFilters, type, categorySlug, callToAction, socialToAction }: Props) => {
  const [openFilter, setOpenFilter] = useState(false);
  const liveParams = useLiveSearchParams();
  const pathname = usePathname();

  const { products, pagination, loading } = useProductSearch(liveParams, type, categorySlug, pageInfo.products, pageInfo.product_pagination);

  const handleUrlChange = (next: URLSearchParams) => {
    const qs = next.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    shallowReplace(url);
  };

  const { title = 'فروشگاه', description } = pageInfo?.category || pageInfo?.brand || {};

  return (
    <ShopProvider
      value={{
        liveParams,
        onUrlChange: handleUrlChange,
        serverFilters: serverFilters.filters,
        sortOptions: serverFilters.sort_options,
      }}>
      <section className='container-shop'>
        <div className='flex flex-col gap-2 mb-4 sm:mb-4'>
          {pageInfo.breadcrumb && <BreadCrumpGenerator items={pageInfo.breadcrumb} {...(type === 'category' && { baseUrl: '/product-category' })} />}
          <h1>{title}</h1>
        </div>

        <div className='grid grid-cols-12 gap-6 mb-20'>
          <Filters />
          <FiltersMobile isOpen={openFilter} onClose={() => setOpenFilter(false)} />
          <div className='col-span-12 xl:col-span-9 shop-box'>
            <ProductList products={products} pagination={pagination} loading={loading} setOpenFilter={setOpenFilter} />
          </div>
        </div>

        {description && (
          <div className='grid grid-cols-12 gap-6 mb-20'>
            <div className='hidden lg:flex lg:col-span-4 xl:col-span-3  flex-col gap-4 px-8.5'>
              <div className='sticky top-25 space-y-4'>
                <div>
                  <LeftCard />
                </div>
                <AstelamCard communications={socialToAction} />
                <DoodiContact callToAction={callToAction} />
              </div>
            </div>

            <div className='col-span-12 lg:col-span-8  xl:col-span-9'>
              <EditorSection content={description} />
            </div>
          </div>
        )}
      </section>
    </ShopProvider>
  );
};

export default Shop;
