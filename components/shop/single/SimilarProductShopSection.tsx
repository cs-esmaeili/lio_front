"use client";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import styles from "@/styles/modules/swipers/NewsProduct.module.css";

import Link from "next/link";
import { useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Pagination, Navigation } from "swiper/modules";

import ProductCard from "@/components/global/Cards/ProductCard";
import Icon from "@/components/global/Icon";

import {
  ArrowLeft,
  ArrowLeft3,
  ArrowRight3,
  TickSquare,
} from "iconsax-reactjs";

type Props = {
  section: any;
};

export default function SimilarProductShopSection({
  section,
}: Props) {

  const swiperRef = useRef<SwiperType | null>(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const products = section?.sections?.similar ?? [];
  // const buttonLink = section?.button_link ?? "#";

  if (!products.length) {
    return null;
  }

  return (
    <section className="container-shop max-sm:px-0">
      <div className="bg-secondary-black-2 py-[40px] px-[25px] max-sm:pl-0 max-sm:pr-[16px] rounded-[20px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-1 pr-4.25 md:pr-0">
            <Icon
              IconComponent={TickSquare}
              size={32}
              variant="Bold"
              className="filter-[drop-shadow(0_4px_4px_rgba(187,139,80,0.25))]"
            />

            <h3 className="text-gray-1">
              محصولات مشابه
            </h3>
          </div>

          <div className="flex gap-4 pl-4.25 md:pl-0">
            <div className="hidden gap-2 md:flex">
              <button
                className={`p-3 border border-primary-1 rounded-[8px] flex justify-center items-center transition-all duration-300 group active:border-secondary-1 ${
                  isBeginning
                    ? "opacity-40 cursor-not-allowed"
                    : "opacity-100 cursor-pointer hover:border-primary-1"
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
                className={`p-3 border border-primary-1 rounded-[8px] flex justify-center items-center transition-all duration-300 group active:border-secondary-1 ${
                  isEnd
                    ? "opacity-40 cursor-not-allowed"
                    : "opacity-100 cursor-pointer hover:border-primary-1"
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

            {/* <Link href={buttonLink}>
              <>
                <button
                  className="hidden md:flex h-[50px] group gap-2 justify-center items-center py-2 px-4 rounded-[8px] select-none bg-primary-4 text-primary-1
                  hover:rounded-[50px] hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer"
                >
                  <span>مشاهده بیشتر</span>

                  <Icon
                    IconComponent={ArrowLeft}
                    size={24}
                    variant="TwoTone"
                  />
                </button>

                <button
                  className="flex md:hidden h-[40px] group gap-2 justify-center items-center py-2 px-4 rounded-[8px] select-none bg-primary-4 text-primary-1
                  hover:rounded-[50px] hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer"
                >
                  <span>همه</span>

                  <Icon
                    IconComponent={ArrowLeft}
                    size={24}
                    variant="TwoTone"
                    className="group-hover:text-secondary-black-3 transition-all duration-1000"
                  />
                </button>
              </>
            </Link> */}
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
            768: { slidesPerView: 3.7 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
            1920: { slidesPerView: 7 },
          }}
        >
          {products.map((product: any) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                data={product}
                onBlackBackGround
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
