import Slider from '@/components/Home/HeroSection/Slider';
import LeftCard from '@/components/Home/HeroSection/LeftCard';

export default function HeroSection({ section }: { section?: any }) {
  const { slider, sideCards } = section;

  return (
    <section className='container relative pt-0 mb-3.5 md:mb-7.5'>
      <div className='grid grid-cols-12 gap-6'>
        <div className={`col-span-12 md:col-span-8 lg:col-span-9 relative outline-0`}>
          <Slider data={slider} />
        </div>
        <div className='col-span-12 md:col-span-4 lg:col-span-3'>
          <LeftCard  data={sideCards} />
        </div>
      </div>
    </section>
  );
}
