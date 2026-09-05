import HeroSection from '@/components/Home/HeroSection/HeroSection';

import OfferSection from '@/components/Home/OfferSection/OfferSection';
import FourBannerSection from '@/components/Home/FourBannerSection/FourBannerSection';
import NewProductSection from '@/components/Home/NewProductSection';
import ThreeBannerSection from '@/components/Home/ThreeBannerSection';
import ProductCategorySection from '@/components/Home/ProductCategorySection';
import FavoriteProductSection from '@/components/Home/FavoriteProductSection';
import InterduceSection from '@/components/Home/InterduceSection';
import DodiyMagSection from '@/components/Home/DodyMagSection';

// template name → component
const sectionComponents: Record<string, React.ComponentType<{ section?: any }>> = {
  'slider': HeroSection,
  //  brand: ProductCategorySection,
  // 'logo-slider': OfferSection,
  // 'category-banner': FourBannerSection,
  // 'list-products': NewProductSection,
  // 'image-contact': ThreeBannerSection,
  // 'base-slider': FavoriteProductSection,
  // introduction: InterduceSection,
  // article: DodiyMagSection,
};

export default function SectionsRenderer({ sections }: { sections: any[] }) {
  const mainSliders = sections.filter((s: any) => s.template === 'main-slider');

  const heroSection = mainSliders.length >= 2 ? { template: 'main-slider', slider: mainSliders[0], sideCards: mainSliders[1] } : mainSliders[0];

  let heroInserted = false;
  const processed = sections.flatMap((s: any) => {
    if (s.template === 'main-slider') {
      if (!heroInserted) {
        heroInserted = true;
        return [heroSection];
      }
      return [];
    }
    return [s];
  });

  return (
    <>
      {processed.map((section: any, index: number) => {
        const Component = sectionComponents[section.type];
        if (!Component) {
          return null;
        }
        return <Component key={index} section={section} />;
      })}
    </>
  );
}
