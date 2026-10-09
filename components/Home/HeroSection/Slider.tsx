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
import { useRef } from "react";

const arrowClass =
  "absolute top-1/2 z-20 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-custom-white/90 text-secondary-black-3 shadow-md backdrop-blur transition-colors hover:bg-custom-white focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-primary-1";

export default function Slider({ slides }: { slides?: any[] }) {
  const swiperRef = useRef<SwiperType | null>(null);
  const items = slides ?? [];

  if (items.length === 0) return null;

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  return (
    <div className="relative h-[447px] overflow-hidden rounded-3xl shadow-lg ring-1 ring-gray-2 md:h-[300px] xl:h-[400px]">
      <button aria-label="اسلاید قبلی" className={`${arrowClass} right-3`} onClick={handlePrev}>
        <Icon IconComponent={ArrowRight2} size={22} variant="Linear" />
      </button>

      <button aria-label="اسلاید بعدی" className={`${arrowClass} left-3`} onClick={handleNext}>
        <Icon IconComponent={ArrowLeft2} size={22} variant="Linear" />
      </button>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[FreeMode, Pagination, Navigation, Autoplay]}
        slidesPerView={1}
        loop={true}
        className="w-full h-full"
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

      <div className="large-pagination absolute! bottom-4! left-1/2! z-10! flex! w-fit! -translate-x-1/2! gap-1.5! rounded-full! bg-secondary-black-3/40! px-2.5! py-1.5! backdrop-blur-sm!" />
    </div>
  );
}
