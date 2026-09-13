import HeroSection from '@/components/Home/HeroSection/HeroSection';
import NewProductSection from '@/components/Home/NewProductSection';
import OfferSection from '@/components/Home/OfferSection/OfferSection';

// section type → component
const sectionComponents: Record<string, React.ComponentType<{ section?: any }>> = {
  SLIDER: HeroSection,
  AMAZING_PRODUCTS: OfferSection,
  PRODUCT_LIST: NewProductSection,
  // BANNER: ThreeBannerSection,
  // INTRODUCTION: InterduceSection,
};

export default function SectionsRenderer({ sections }: { sections: any[] }) {
  return (
    <>
      {sections.map((section: any) => {
        const Component = sectionComponents[section.type];
        if (!Component) {
          return null;
        }
        return <Component key={section.id} section={section} />;
      })}
    </>
  );
}
