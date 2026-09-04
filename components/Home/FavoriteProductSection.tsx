'use client';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import styles from '@/styles/modules/swipers/FavoriteProduct.module.css';
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { FreeMode, Pagination, Navigation } from 'swiper/modules';
import { Spinner } from '@/components/shadcn/spinner';
import ProductCard from '@/components/global/Cards/ProductCard';
import bordersStyle from '@/styles/modules/borders/ProductListsHome.module.css';
import Icon from '@/components/global/Icon';
import { favoriteProductSectionTab } from '@/services/home.service';

import { ArrowLeft3, ArrowRight3, TickSquare } from 'iconsax-reactjs';
import MoreButton from '@/components/Home/MoreButton';

export default function FavoriteProductSection({ section }: { section?: any }) {
  const { items: tabs, button_link, title } = section;


  const tabsWithActive = tabs.map((tab: { id: number; title: string; slug: string }, i: number) => ({
    ...tab,
    isActive: i === 0,
  }));

  const swiperRef = useRef<SwiperType | null>(null);
  const [swiperState, setSwiperState] = useState({
    isBeginning: true,
    isEnd: false,
  });
  const [activeCategories, setActiveCategories] = useState(tabsWithActive);
  const [currentProducts, setCurrentProducts] = useState<any[]>([]);
  const [isChanging, setIsChanging] = useState(false);

  const fetchTabProducts = async (tabSlug: string) => {
    try {
      const res = await favoriteProductSectionTab(section.id, tabSlug);

      if (res?.status === 200 && res?.data?.products) {
        setCurrentProducts(res.data.products);
      } else {
        setCurrentProducts([]);
      }
    } catch {
      setCurrentProducts([]);
    }
  };

  // Fetch first tab's products on mount
  useEffect(() => {
    if (tabsWithActive.length > 0) {
      fetchTabProducts(tabsWithActive[0].slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = async (clickedId: number) => {
    const clickedTab = tabsWithActive.find((t: any) => t.id === clickedId);
    if (!clickedTab) return;

    setActiveCategories((prev: any[]) =>
      prev.map((cat: any) => ({
        ...cat,
        isActive: cat.id === clickedId,
      }))
    );

    setIsChanging(true);
    await fetchTabProducts(clickedTab.slug);
    setIsChanging(false);
  };

  return (
    <section className='container max-sm:px-0'>
      <div className='bg-secondary-black-2 py-10 px-6.25 max-sm:pl-0 max-sm:pr-4 rounded-[20px]'>
        <div className='grid grid-cols-6 gap-5 justify-between items-center mb-6'>
          <div className='flex gap-1 order-1 lg:order-0 col-span-4 lg:col-span-2'>
            <Icon IconComponent={TickSquare} size={32} variant='Bold' className='filter-[drop-shadow(0_4px_4px_rgba(187,139,80,0.25))]' />
            <h2 className='flex text-gray-1 lg:text-[22px]!'>{title}</h2>
          </div>

          <div className='flex text-gray-1  order-3 lg:order-0 col-span-6 lg:col-span-2 justify-center items-center'>
            {activeCategories.map((category: any) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  py-1 px-2 transition-all duration-300 cursor-pointer relative
                  focus:outline-none focus:ring-0 active:outline-none
                  ${category.isActive ? 'text-primary-1' : 'hover:text-primary-black-1'}
                `}>
                <span className='relative inline-block py-1'>
                  {category.title}
                  {category.isActive && (
                    <>
                      <span className='absolute -bottom-px left-0 right-0 h-px transition-opacity duration-300 bg-linear-to-r from-transparent via-primary-1 to-transparent' />

                      <span className='absolute -top-px left-0 right-0 h-px transition-opacity duration-300 bg-linear-to-r from-transparent via-primary-1 to-transparent' />
                    </>
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className='flex gap-4 order-2 lg:order-0 col-span-2 lg:col-span-2 pl-4.25 lg:pl-0 justify-end'>
            <div className='hidden gap-2 lg:flex'>
              <button
                className={`p-3 border border-primary-1 rounded-[8px] flex justify-center items-center transition-all duration-300 group active:border-secondary-1 ${
                  swiperState.isBeginning ? 'opacity-40 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:border-primary-1'
                }`}
                onClick={() => {
                  if (!swiperState.isBeginning) {
                    swiperRef.current?.slidePrev();
                  }
                }}
                disabled={swiperState.isBeginning}>
                <Icon IconComponent={ArrowRight3} size={24} variant='Outline' className='group-active:text-secondary-1' />
              </button>
              <button
                className={`p-3 border border-primary-1 rounded-[8px] flex justify-center items-center transition-all duration-300 group active:border-secondary-1 ${
                  swiperState.isEnd ? 'opacity-40 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:border-primary-1'
                }`}
                onClick={() => {
                  if (!swiperState.isEnd) {
                    swiperRef.current?.slideNext();
                  }
                }}
                disabled={swiperState.isEnd}>
                <Icon IconComponent={ArrowLeft3} size={24} variant='Outline' className='group-active:text-secondary-1' />
              </button>
            </div>
            <MoreButton link={button_link} light />
          </div>
        </div>

        <div className={`transition-all duration-300 ease-in-out  ${bordersStyle.productListBorder}`} style={{ minHeight: '400px' }}>
          {isChanging && (
            <div className='flex justify-center items-center min-h-[400px]'>
              <Spinner className='size-10 text-primary-1' />
            </div>
          )}
          {!isChanging && currentProducts.length > 0 && (
            <Swiper
              key={currentProducts.length}
              className={`${styles.swiper}`}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setSwiperState({
                  isBeginning: swiper.isBeginning,
                  isEnd: swiper.isEnd,
                });
              }}
              onSlideChange={(swiper) => {
                setSwiperState({
                  isBeginning: swiper.isBeginning,
                  isEnd: swiper.isEnd,
                });
              }}
              modules={[FreeMode, Pagination, Navigation]}
              loop={true}
              breakpoints={{
                0: { slidesPerView: 1.8 },
                390: { slidesPerView: 2.1 },
                510: { slidesPerView: 2.5 },
                768: { slidesPerView: 3.7 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
              }}>
              {currentProducts.map((pro, index) => (
                <SwiperSlide key={pro.id}>
                  <ProductCard data={pro} onBlackBackGround showBorder={index !== currentProducts.length - 1} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}
