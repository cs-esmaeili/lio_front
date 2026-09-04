'use client';

import { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';

import OfferCard from '@/components/Home/OfferSection/OfferCard';
import Products from '@/components/Home/OfferSection/Products';

const OfferSection = ({ section }: { section?: any }) => {

  const swiperRef = useRef<SwiperType | null>(null);

  const offerData = {
    link: '/products/special-offer', // لینک دلخواه
    expiryTime: 7200, // 2 ساعت به ثانیه
  };
  
  const products = section?.data?.products ?? [];


  return (
    <section className='container max-sm:pl-0 -mt-5 lg:mt-0'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        <div className='lg:col-span-3 w-full lg:max-[1280px]:col-span-4 max-sm:w-[calc(100%-1rem)]'>
          <OfferCard
            onPrev={() => swiperRef.current?.slidePrev()}
            onNext={() => swiperRef.current?.slideNext()}
            link={section.button_link}
            expiryTime={offerData.expiryTime}
          />
        </div>

        <div className='lg:col-span-9  lg:max-[1280px]:col-span-8'>
          <Products ref={swiperRef} data={products}/>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
