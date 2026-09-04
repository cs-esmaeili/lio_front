import Counter from '@/components/Home/counter';
import AboutUsDivider from '@/components/about-us/AboutUsDivider';

interface StatisticItem {
  id: number;
  title: string;
  description: string; 
  image: string | null;
  number?: number | null;
}

interface AboutUsCounterProps {
  statistics?: StatisticItem[];
  title?: string;
}

export default function AboutUsCounter({ 
  statistics = [], 
  title = 'آمار' 
}: AboutUsCounterProps) {
  
  if (!statistics || statistics.length === 0) {
    return (
      <div className='counterPart mt-12 lg:mt-16 rounded-2xl bg-linear-to-b from-secondary-black-3 via-secondary-1 to-secondary-black-3 py-9 px-5 lg:px-11'>
        <p className='text-center text-white'>هیچ آماری یافت نشد</p>
      </div>
    );
  }

  // فقط 4 آمار اول را بگیر
  const displayStatistics = statistics.slice(0, 4);

  return (
    <div className='counterPart mt-12 lg:mt-16 lg:h-[296px] rounded-2xl bg-linear-to-b from-secondary-black-3 via-secondary-1 to-secondary-black-3 py-9 px-5 lg:px-11 flex flex-col lg:flex-row items-center justify-center'>

      <div className='filledBoxpx-5 xl:px-10 py-6 lg:w-1/4 w-full shrink-0 h-full bg-primary-1 rounded-2xl flex flex-col justify-center items-center text-white'>
        <Counter 
          className='mr-6 number font-rajdhani text-[3.5rem] font-thin text-white' 
          end={displayStatistics[0]?.number || displayStatistics[0]?.id || 0} 
          suffix='+' 
        />
        <h4 className='mt-4'>{displayStatistics[0]?.title || 'بدون عنوان'}</h4>
        <span className='text-center mt-2 font-defult text-gray-3'>
          {displayStatistics[0]?.description || ''} 
        </span>
      </div>
      
      {/* سه آیتم دیگر */}
      <div className='w-full lg:w-3/4 flex flex-col lg:flex-row items-center justify-around'>

        <div className='px-5 xl:px-10 py-6 h-full flex flex-1 flex-col justify-center items-center text-white'>
          <Counter 
            className='mr-6 number font-rajdhani text-[3.5rem] font-thin text-primary-2' 
            end={displayStatistics[1]?.number || displayStatistics[1]?.id || 0} 
            suffix='+' 
          />
          <h4 className='mt-4'>{displayStatistics[1]?.title || 'بدون عنوان'}</h4>
          <span className='text-center mt-2 font-defult text-gray-3'>
            {displayStatistics[1]?.description || ''} 
          </span>
        </div>
        
        <AboutUsDivider />

        <div className='px-5 xl:px-10 py-6 h-full flex flex-1 flex-col justify-center items-center text-white'>
          <Counter 
            className='mr-6 number font-rajdhani text-[3.5rem] font-thin text-primary-2' 
            end={displayStatistics[2]?.number || displayStatistics[2]?.id || 0} 
            suffix='+' 
          />
          <h4 className='mt-4'>{displayStatistics[2]?.title || 'بدون عنوان'}</h4>
          <span className='text-center mt-2 font-defult text-gray-3'>
            {displayStatistics[2]?.description || ''} 
          </span>
        </div>
        
        <AboutUsDivider />
        
        <div className='px-5 xl:px-10 py-6 h-full flex flex-1 flex-col justify-center items-center text-white'>
          <Counter 
            className='mr-6 number font-rajdhani text-[3.5rem] font-thin text-primary-2' 
            end={displayStatistics[3]?.number || displayStatistics[3]?.id || 0} 
            suffix='+' 
          />
          <h4 className='mt-4'>{displayStatistics[3]?.title || 'بدون عنوان'}</h4>
          <span className='text-center mt-2 font-defult text-gray-3'>
            {displayStatistics[3]?.description || ''} 
          </span>
        </div>

      </div>

    </div>
  );
}