'use client';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import styles from '@/styles/modules/swipers/NewsProduct.module.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import ProductCard from '@/components/global/Cards/ProductCard';
import Icon from '@/components/global/Icon';
import bordersStyle from '@/styles/modules/borders/ProductListsHome.module.css';
import { TickSquare } from 'iconsax-reactjs';
import MoreButton from '@/components/Home/MoreButton';

export default function NewProductSection({ section }: { section?: any }) {
  const products = section?.data?.products ?? [];
  const link = section?.link ?? '/shop';

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

          <MoreButton link={link} />
        </div>

        <Swiper
          modules={[FreeMode, Pagination]}
          loop={true}
          spaceBetween={16}
          wrapperClass='p-1'
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
