import Image from 'next/image';

interface AboutUsFounderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string; 
  signature?: string; 
}

export default function AboutUsFounder({ 
  title = 'با دودیگرام بیشتر آشنا شوید...', 
  subtitle = 'با دودیگرام بیشتر آشنا شوید...', 
  description = '', 
  image = '',
  signature = '' 
}: AboutUsFounderProps) {
  const cleanDescription = description?.replace(/<[^>]*>/g, '') || '';

  return (
    <div className='founderedPart mt-2 lg:mt-16 py-12'>
      <div className='grid grid-cols-1 lg:grid-cols-5 h-full gap-x-8'>
        <div className='speech h-full flex flex-col items-start justify-center text-justify order-2 lg:order-1 lg:col-span-3 '>
          <h4 className='mt-4 text-c-primary-1'>{title}</h4>
          <h2 className='mt-4 text-c-primary-1'>{subtitle}</h2>
          <div className='text-body mt-4 text-secondary-1'>
            <span dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          
          {signature && (
            <Image
              alt='امضای موسس'
              src={signature}
              height={110}
              width={237}
              className='mr-auto mt-4 h-20 w-31.25 lg:h-[110px] lg:w-[237px]'
            />
          )}
        </div>
        
        <div className='order-1 lg:order-2 imapepart mt-4 lg:col-span-2'>
          {image && (
            <Image 
              alt={title} 
              src={image} 
              height={513} 
              width={515} 
              className='h-85.75 w-88.5 lg:h-128.25 lg:w-128.75 mx-auto'
            />
          )}
        </div>
      </div>
    </div>
  );
}