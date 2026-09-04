'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import ZoomWrapper from '@/components/shop/single/ZoomWrapper';
import fadeStyles from '@/styles/modules/imageFade.module.css';

import 'swiper/css';
import 'swiper/css/thumbs';

type ImageType = {
  id: number | string;
  src: string;
  alt: string;
};

type ImageGalleryProps = {
  images: ImageType[];
};

// thumb image with onLoad → fade-in
function ThumbImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      onLoad={() => setLoaded(true)}
      className={`object-cover rounded-lg border border-primary-3 ${loaded ? fadeStyles.fadeIn : 'opacity-0'}`}
    />
  );
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  if (!images || images.length === 0) {
    return <div className='w-full h-[350px] bg-gray-100 rounded-xl flex items-center justify-center'>تصویری وجود ندارد</div>;
  }

  return (
    <div className='w-full max-w-[1000px] mx-auto'>
      {/* اسلایدر اصلی */}
      <div className='relative mb-2 md:mb-5 rounded-xl overflow-hidden bg-gray-100 border border-gray-200'>
        <Swiper modules={[Thumbs]} spaceBetween={20} slidesPerView={1} loop={true} thumbs={{ swiper: thumbsSwiper }}>
          {images.map((image, idx) => (
            <SwiperSlide key={image.id}>
              <div className='w-full h-[350px] md:h-[500px]'>
                <ZoomWrapper src={image.src} alt={image.alt} priority={idx === 0} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* تصاویر کوچک */}
      {images.length > 1 && 
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}>
          {images.map((image) => (
            <SwiperSlide key={`thumb-${image.id}`}>
              <div className='relative w-full h-20 cursor-pointer opacity-60 hover:opacity-100 transition-opacity thumbnail-slide'>
                <ThumbImage src={image.src} alt={image.alt} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      }

      <style jsx>{`
        :global(.swiper-slide-thumb-active) .thumbnail-slide {
          opacity: 1;
          border: 1px solid var(--primary-1);
          border-radius: var(--radius-lg);
        }
      `}</style>
    </div>
  );
};

export default ImageGallery;
