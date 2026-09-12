"use client";

import styles from "@/styles/modules/Carves.module.css";

import "swiper/css";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Navigation, Autoplay } from "swiper/modules";
import { useRef } from "react";
import Icon from "@/components/global/Icon";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import ResponsiveImage from "./ResponsiveImage";

export default function LeftCard({ data }: { data?: any }) {
  const swiperRef = useRef<SwiperType | null>(null);
  const items = data?.slides ?? [];

  if (items.length === 0) return null;

  return (
    <div className={`relative h-[250px] md:h-[300px] xl:h-[400px] ${styles.rightCarve} ${styles.leftCarve}`}>
      <button
        className="absolute top-[49%] -translate-y-1/2 right-2 translate-x-1/2 z-20 cursor-pointer"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <Icon
          IconComponent={ArrowRight2}
          size={24}
          variant="Outline"
          className="text-secondary-black-2"
        />
      </button>
      <button
        className=" absolute top-[49%] -translate-y-1/2 -translate-x-1/2  left-2 p-3 z-20 cursor-pointer"
        onClick={() => swiperRef.current?.slideNext()}
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
        modules={[FreeMode, Navigation, Autoplay]}
        slidesPerView={1}
        loop={true}
        touchAngle={45}
        touchReleaseOnEdges={true}
        nested={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        className={`w-full h-full relative rounded-xl`}
      >
        {items.map((item: any) => (
          <SwiperSlide key={item.id} className="w-full h-full">
            <div className="h-full">
              <ResponsiveImage item={item} use="leftCart" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
