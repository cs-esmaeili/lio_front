'use client';

import { useState, useEffect } from 'react';
import BannerCard from '@/components/Home/FourBannerSection/BannerCard';



export default function FourBannerSection({ section }: { section?: any }) {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  const banners = section?.data?.banners ?? [];


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
        {banners.map((item: any, index: number) => (
          <BannerCard
            key={item.id ?? index}
            src={item.desktopFileUrl}
            mobile_src={item.mobileFileUrl}
            tablet_src={item.tabletFileUrl}
            titleEn={item.subtitle}
            titleFa={item.title}
            buttonTitle={item.buttonTitle}
            link={item.buttonUrl}
            active={!isMobile && activeIndex === index}
            onHover={() => handleHover(index)}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
}
