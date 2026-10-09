'use client';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import styles from '@/styles/modules/swipers/NewsProduct.module.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';

import ProductCard from '@/components/global/Cards/ProductCard';
import Icon from '@/components/global/Icon';
import MoreButton from '@/components/Home/MoreButton';
import bordersStyle from '@/styles/modules/borders/ProductListsHome.module.css';
import type { ProductCardItem } from '@/typescript/schemas/products/product-details.schema';

import { TickSquare } from 'iconsax-reactjs';

export default function SimilarProductShopSection({
  products,
  link = '/shop',
}: {
  products: ProductCardItem[];
  link?: string;
}) {
  if (!products.length) {
    return null;
  }

  return (
    <section className='container-shop max-sm:pl-0 max-sm:pr-global '>
      <div className='rounded-3xl p-4 md:p-6 bg-primary'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-4'>
              <Icon IconComponent={TickSquare} size={22} variant='Bold' className='text-primary-1' />
            </span>
            <h2 className='text-base font-bold text-gray-1 lg:text-[22px]'>محصولات مشابه</h2>
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
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard data={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
