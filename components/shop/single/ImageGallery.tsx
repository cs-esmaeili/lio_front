'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Gallery, Item } from 'react-photoswipe-gallery';
import ZoomWrapper from '@/components/shop/single/ZoomWrapper';
import fadeStyles from '@/styles/modules/imageFade.module.css';

import 'swiper/css';
import 'swiper/css/thumbs';
import 'photoswipe/dist/photoswipe.css';

type ImageType = {
  id: number | string;
  src: string;
  alt: string;
};

type ImageGalleryProps = {
  images: ImageType[];
};

type ImageSize = { width: number; height: number };

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
  const [sizes, setSizes] = useState<Record<string, ImageSize>>({});

  // PhotoSwipe needs each image's natural size; the API does not return it,
  // so probe the originals once and feed the dimensions into each <Item>.
  useEffect(() => {
    let cancelled = false;

    images.forEach((image) => {
      const probe = new window.Image();

      probe.onload = () => {
        if (cancelled || !probe.naturalWidth || !probe.naturalHeight) return;

        setSizes((prev) =>
          prev[image.id]
            ? prev
            : { ...prev, [image.id]: { width: probe.naturalWidth, height: probe.naturalHeight } },
        );
      };

      probe.src = image.src;
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  if (!images || images.length === 0) {
    return <div className='w-full h-[350px] bg-gray-100 rounded-xl flex items-center justify-center'>تصویری وجود ندارد</div>;
  }

  return (
    <div className='w-full max-w-[1000px] mx-auto'>
      <Gallery options={{ bgOpacity: 0.9 }}>
        {/* اسلایدر اصلی */}
        <div className='relative mb-2 md:mb-5 rounded-xl overflow-hidden bg-gray-100 border border-gray-200'>
          <Swiper modules={[Thumbs]} spaceBetween={20} slidesPerView={1} thumbs={{ swiper: thumbsSwiper }}>
            {images.map((image, idx) => (
              <SwiperSlide key={image.id}>
                <Item
                  original={image.src}
                  thumbnail={image.src}
                  width={sizes[image.id]?.width}
                  height={sizes[image.id]?.height}
                  alt={image.alt}>
                  {({ ref, open }) => (
                    <div
                      ref={ref}
                      onClick={open}
                      role='button'
                      tabIndex={0}
                      aria-label={image.alt}
                      className='w-full h-[350px] md:h-[500px] cursor-zoom-in'>
                      <ZoomWrapper src={image.src} alt={image.alt} priority={idx === 0} />
                    </div>
                  )}
                </Item>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Gallery>

      {/* تصاویر کوچک */}
      {images.length > 1 && (
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
      )}

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
