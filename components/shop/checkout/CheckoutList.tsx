"use client";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import styles from "@/styles/modules/swipers/NewsProduct.module.css";

import { useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Pagination, Navigation } from "swiper/modules";

import CheckoutCard from "@/components/shop/checkout/CheckoutCard";
import Icon from "@/components/global/Icon";

import {
  ArrowLeft3,
  ArrowRight3,
  TickSquare,
} from "iconsax-reactjs";

import type { BasketItem } from "@/components/shop/basket/basket.types";

type Props = {
  items: BasketItem[];
};

export default function CheckoutList({ items }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!items.length) {
    return null;
  }

  return (
    <section className="block -mt-6 md:-mt-18">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1">

        </div>

        <div className="hidden gap-2 md:flex">
          <button
            className={`group flex items-center justify-center rounded-[8px] border border-primary-1 p-2 transition-all duration-300 active:border-secondary-1 ${
              isBeginning
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer opacity-100 hover:border-primary-1"
            }`}
            onClick={() => {
              if (!isBeginning) {
                swiperRef.current?.slidePrev();
              }
            }}
            disabled={isBeginning}
          >
            <Icon
              IconComponent={ArrowRight3}
              size={24}
              variant="Outline"
              className="group-active:text-secondary-1"
            />
          </button>

          <button
            className={`group flex items-center justify-center rounded-[8px] border border-primary-1 p-2 transition-all duration-300 active:border-secondary-1 ${
              isEnd
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer opacity-100 hover:border-primary-1"
            }`}
            onClick={() => {
              if (!isEnd) {
                swiperRef.current?.slideNext();
              }
            }}
            disabled={isEnd}
          >
            <Icon
              IconComponent={ArrowLeft3}
              size={24}
              variant="Outline"
              className="group-active:text-secondary-1"
            />
          </button>
        </div>
      </div>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        modules={[FreeMode, Pagination, Navigation]}
        className={styles.swiper}
        breakpoints={{
          0: { slidesPerView: 1.8 },
          390: { slidesPerView: 2.1 },
          510: { slidesPerView: 2.5 },
          768: { slidesPerView: 2.7 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 4 },
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={String(item.product.product_price_id)}>
            <CheckoutCard data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}