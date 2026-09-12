import Slider from '@/components/Home/HeroSection/Slider';

export default function HeroSection({ section }: { section?: any }) {
  const slides = section?.data?.slides ?? [];

  if (slides.length === 0) return null;

  return (
    <section className='container relative pt-0 mb-3.5 md:mb-7.5'>
      <div className='relative outline-0'>
        <Slider slides={slides} />
      </div>
    </section>
  );
}
