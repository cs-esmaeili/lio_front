"use client";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import styles from "@/styles/modules/swipers/ProductCategory.module.css";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Pagination, Navigation } from "swiper/modules";
import CategoryCard from "@/components/global/Cards/CategoryCard";

export default function ProductCategorySection({ section }: { section?: any }) {
  const items = section?.data?.brands?.brands;

  if (!items || items.length === 0) {
    return null;
  }

  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="container max-sm:p-0 -mt-10 lg:-mt-4 hidden md:block">
      {section?.title && <h2 className="text-center text-primary-1 mb-6">{section.title}</h2>}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[FreeMode, Pagination, Navigation]}
        spaceBetween={25}
        slidesPerView={10}
        className={styles.swiper}
        breakpoints={{
          0: { slidesPerView: 2.5 },
          480: { slidesPerView: 4 },
          768: { slidesPerView: 6 },
          1024: { slidesPerView: 10 },
        }}
      >
        {items.map((item: any) => (
          <SwiperSlide key={item.id}>
            <CategoryCard
              id={item.id}
              image={item.image}
              link={`/product-category/${item.slug}/`}
              title={item.title}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
