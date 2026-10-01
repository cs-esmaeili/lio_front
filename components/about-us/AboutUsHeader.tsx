import Image from 'next/image';
import PageTitle from '@/components/global/PageTitle';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

interface AboutUsHeaderProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function AboutUsHeader({ title = `با ${siteName} بیشتر آشنا شوید...`, description = '', image = '' }: AboutUsHeaderProps) {
  const cleanDescription = description?.replace(/<[^>]*>/g, '') || '';

  return (
    <>
      <PageTitle title={title} />
      <div className='headerPart mt-6'>
        <div className='text-secondary-1 text-body text-center'>
          <span dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <div className='relative mt-10 lg:mt-14 h-[224px] md:h-[424px] w-full'>
          {image && <Image src={image} alt={title} fill className='object-cover rounded-2xl' />}

          {/* {image && <Image src='/test/about-us.png' alt={siteName} fill className='object-cover rounded-lg' />} */}
        </div>
      </div>
    </>
  );
}
