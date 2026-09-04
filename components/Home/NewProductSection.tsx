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

export default function NewProductSection({ section }: { section?: any }) {
  const products = section?.data?.products ?? [];
  const button_link = section?.button_link ?? '/shop';

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
      <div className='flex justify-between items-center mb-6'>
        <div className='flex gap-1 pr-4.25 md:pr-0'>
          <Icon IconComponent={TickSquare} size={32} variant='Bold' className='filter-[drop-shadow(0_4px_4px_rgba(187,139,80,0.25))]' />
          <h2 className='text-secondary-black-1 lg:text-[22px]'>جدیدترین محصولات</h2>
        </div>

        <div className='flex gap-4 pl-4.25 md:pl-0'>
          <div className='hidden gap-2 md:flex'>
            <button
              className={`p-3 border border-primary-1 rounded-[8px] flex justify-center items-center transition-all duration-300 group active:border-secondary-1 ${
                isBeginning ? 'opacity-40 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:border-primary-1'
              }`}
              onClick={() => {
                if (!isBeginning) {
                  swiperRef.current?.slidePrev();
                }
              }}
              disabled={isBeginning}>
              <Icon IconComponent={ArrowRight3} size={24} variant='Outline' className='group-active:text-secondary-1' />
            </button>
            <button
              className={`p-3 border border-primary-1 rounded-[8px] flex justify-center items-center transition-all duration-300 group active:border-secondary-1 ${
                isEnd ? 'opacity-40 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:border-primary-1'
              }`}
              onClick={() => {
                if (!isEnd) {
                  swiperRef.current?.slideNext();
                }
              }}
              disabled={isEnd}>
              <Icon IconComponent={ArrowLeft3} size={24} variant='Outline' className='group-active:text-secondary-1' />
            </button>
          </div>

          <MoreButton link={button_link} />
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
    </section>
  );
}
