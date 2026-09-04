'use client';

import { useState, useEffect } from 'react';
import BannerCard from '@/components/Home/FourBannerSection/BannerCard';



export default function FourBannerSection({ section }: { section?: any }) {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  const products = section.items['statuses.orientation_key.'];


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleHover = (index: number) => {
    if (!isMobile) {
      setActiveIndex(index);
    }
  };

  return (
    <section className='container-wide hidden md:block'>
      <div className='grid grid-cols-2 md:grid-cols-4'>
        {products.map((item: any, index: number) => (
          <BannerCard
            key={index}
            src={item.src}
            mobile_src={item.mobile_src}
            tablet_src={item.tablet_src}
            titleEn={"titleEN"}
            titleFa={item.alt}
            link={item.link}
            active={!isMobile && activeIndex === index}
            onHover={() => handleHover(index)}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
}
