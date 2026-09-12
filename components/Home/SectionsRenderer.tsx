import HeroSection from '@/components/Home/HeroSection/HeroSection';

// section type → component
const sectionComponents: Record<string, React.ComponentType<{ section?: any }>> = {
  SLIDER: HeroSection,
  // PRODUCT_LIST: NewProductSection,
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
