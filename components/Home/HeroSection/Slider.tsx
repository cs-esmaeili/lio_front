"use client";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import ResponsiveImage from "./ResponsiveImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import Icon from "@/components/global/Icon";
import styles from "@/styles/modules/Carves.module.css";
import { useRef } from "react";

export default function Slider({ data }: { data?: any }) {
  const swiperRef = useRef<SwiperType | null>(null);
  const items = data?.items || [];

  if (items.length === 0) return null;

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  return (
    <div
      className={`relative h-[447px] md:h-[300px] xl:h-[400px] ${styles.rightCarve} ${styles.leftCarve} ${styles.bottomCarve}`}
    >
      <button
        aria-label="اسلاید قبلی"
        className="absolute top-[49%] -translate-y-1/2 right-2 translate-x-1/2 z-20 cursor-pointer"
        onClick={handlePrev}
      >
        <Icon
          IconComponent={ArrowRight2}
          size={24}
          variant="Outline"
          className="text-secondary-black-2"
        />
      </button>

      <button
        aria-label="اسلاید بعدی"
        className="absolute top-[49%] -translate-y-1/2 -translate-x-1/2 left-2 p-3 z-20 cursor-pointer"
        onClick={handleNext}
      >
        <Icon
          IconComponent={ArrowLeft2}
          size={24}
          variant="Outline"
          className="text-secondary-black-2"
        />
      </button>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[FreeMode, Pagination, Navigation, Autoplay]}
        slidesPerView={1}
        loop={true}
        className="w-full h-full relative rounded-xl"
        touchAngle={45}
        touchReleaseOnEdges={true}
        nested={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          el: ".large-pagination",
          bulletClass: "swiper-custom-bullet",
          bulletActiveClass: "swiper-custom-bullet-active",
          clickable: true,
        }}
      >
        {items.map((item: any) => (
          <SwiperSlide key={item.id} className="w-full h-full">
            <div className="h-full max-h-120">
              <ResponsiveImage item={item} use="slider" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className={`large-pagination absolute! bottom-0! w-fit! left-1/2! -translate-x-1/2! md:left-[80%]! lg:left-[90%]! z-10! bg-transparent! flex! gap-1! ${styles.pagination}`}
      />
    </div>
  );
}
