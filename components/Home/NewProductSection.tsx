'use client';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import styles from '@/styles/modules/swipers/NewsProduct.module.css';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { FreeMode, Pagination, Navigation } from 'swiper/modules';
import ProductCard from '@/components/global/Cards/ProductCard';
import Icon from '@/components/global/Icon';
import bordersStyle from '@/styles/modules/borders/ProductListsHome.module.css';
import { ArrowLeft3, ArrowRight3, TickSquare } from 'iconsax-reactjs';
import MoreButton from '@/components/Home/MoreButton';

const navButton =
  'flex size-10 items-center justify-center rounded-full border border-gray-2 bg-custom-white text-secondary-black-3 transition-all duration-300';

export default function NewProductSection({ section }: { section?: any }) {
  const products = section?.data?.products ?? [];
  const link = section?.link ?? '/shop';

  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (swiper) {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    }
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className='container max-sm:pl-0 max-sm:pr-global'>
      <div className='rounded-3xl bg-gray-1 p-4 md:p-6'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-4'>
              <Icon IconComponent={TickSquare} size={22} variant='Bold' className='text-primary-1' />
            </span>
            <h2 className='text-base font-bold text-secondary-black-3 lg:text-[22px]'>{section?.title}</h2>
          </div>

          <div className='flex items-center gap-3'>
            <div className='hidden gap-2 md:flex'>
              <button
                type='button'
                aria-label='قبلی'
                className={`${navButton} ${isBeginning ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:border-primary-1 hover:text-primary-1'}`}
                onClick={() => {
                  if (!isBeginning) {
                    swiperRef.current?.slidePrev();
                  }
                }}
                disabled={isBeginning}>
                <Icon IconComponent={ArrowRight3} size={20} variant='Outline' className='text-current' />
              </button>

              <button
                type='button'
                aria-label='بعدی'
                className={`${navButton} ${isEnd ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:border-primary-1 hover:text-primary-1'}`}
                onClick={() => {
                  if (!isEnd) {
                    swiperRef.current?.slideNext();
                  }
                }}
                disabled={isEnd}>
                <Icon IconComponent={ArrowLeft3} size={20} variant='Outline' className='text-current' />
              </button>
            </div>

            <MoreButton link={link} />
          </div>
        </div>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          modules={[FreeMode, Pagination, Navigation]}
          loop={true}
          spaceBetween={16}
          className={`${styles.swiper} ${bordersStyle.productListBorder}`}
          breakpoints={{
            0: { slidesPerView: 1.8 },
            390: { slidesPerView: 2.1 },
            510: { slidesPerView: 2.5 },
            768: { slidesPerView: 3.7 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}>
          {products.map((pro: any, index: number) => (
            <SwiperSlide key={index}>
              <ProductCard data={pro} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
