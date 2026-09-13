'use client';

import 'swiper/css';
import 'swiper/css/free-mode';
import styles from '@/styles/modules/swipers/OfferProduct.module.css';
import bordersStyle from '@/styles/modules/borders/ProductListsHome.module.css';
import { Ref } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { FreeMode, Navigation } from 'swiper/modules';

import ProductCard from '@/components/global/Cards/ProductCard';

const Products = ({ ref, products }: { ref: Ref<SwiperType>; products: any[] }) => {
  return (
    <div className={`${bordersStyle.productListBorder}`}>
      {products.length > 0 && (
        <Swiper
          onSwiper={(swiper) => {
            if (typeof ref === 'function') {
              ref(swiper);
            } else if (ref) {
              ref.current = swiper;
            }
          }}
          modules={[FreeMode, Navigation]}
          className={styles.swiper}
          breakpoints={{
            0: { slidesPerView: 1.8 },
            390: { slidesPerView: 2.1 },
            480: { slidesPerView: 2.5 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 3.3 },
            1280: { slidesPerView: 4.5 },
          }}>
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard data={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Products;
