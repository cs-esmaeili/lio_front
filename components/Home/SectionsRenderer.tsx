import HeroSection from '@/components/Home/HeroSection/HeroSection';
import NewProductSection from '@/components/Home/NewProductSection';
import OfferSection from '@/components/Home/OfferSection/OfferSection';
import FourBannerSection from '@/components/Home/FourBannerSection/FourBannerSection';
import ThreeBannerSection from '@/components/Home/ThreeBannerSection';
import InterduceSection from '@/components/Home/InterduceSection';
import type { HomeSection } from '@/typescript/schemas/home/home-sections.schema';

// section location → component
const sectionComponents: Record<string, React.ComponentType<{ section: HomeSection }>> = {
  SLIDER: HeroSection,
  AMAZING_PRODUCTS: OfferSection,
  PRODUCT_LIST: NewProductSection,
  BANNER_4: FourBannerSection,
  BANNER_3: ThreeBannerSection,
  INTRODUCTION: InterduceSection,
};

export default function SectionsRenderer({ sections }: { sections: HomeSection[] }) {
  return (
    <>
      {sections.map((section) => {
        const Component = sectionComponents[section.location];
        if (!Component) {
          return null;
        }
        return <Component key={section.id} section={section} />;
      })}
    </>
  );
}
