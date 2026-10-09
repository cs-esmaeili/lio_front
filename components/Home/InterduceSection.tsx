'use client';
import { getImageProps } from 'next/image';
import Link from 'next/link';
import Counter from '@/components/Home/counter';
import { motion } from 'motion/react';

const normalizeUrl = (url: string) =>
  url.startsWith('http://127.0.0.1:8001/') ? url.replace('http://127.0.0.1:8001/', 'https://dudigram.behidopro.ir/') : url;

type InterduceImageProps = {
  desktopFileUrl: string;
  tabletFileUrl: string;
  mobileFileUrl: string;
  alt?: string;
  link?: string;
};

function InterduceImage({ desktopFileUrl, tabletFileUrl, mobileFileUrl, alt = '', link }: InterduceImageProps) {
  const commonProps = { alt: alt || '', sizes: '100vw' };

  const src = normalizeUrl(desktopFileUrl);
  const tabletSrc = normalizeUrl(tabletFileUrl);
  const mobileSrc = normalizeUrl(mobileFileUrl);

  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...commonProps,
    src,
    width: 1014,
    height: 416,
  });

  const {
    props: { srcSet: tablet },
  } = getImageProps({
    ...commonProps,
    src: tabletSrc,
    width: 768,
    height: 416,
  });

  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...commonProps,
    src: mobileSrc,
    width: 361,
    height: 182,
  });

  const picture = (
    <picture>
      <source media='(max-width:768px)' srcSet={mobile} />
      <source media='(min-width:769px) and (max-width:1024px)' srcSet={tablet} />
      <source media='(min-width:1025px)' srcSet={desktop} />
      <img {...rest} className='w-full h-full object-cover object-bottom' alt={alt || ''} />
    </picture>
  );

  if (link) {
    return (
      <Link href={link} className='block w-full h-full'>
        {picture}
      </Link>
    );
  }

  return picture;
}

const STATS = [
  { end: 500, label: 'دسته محصول' },
  { end: 20000, label: 'خریدار رضایتمند' },
  { end: 5000, label: 'محصول مختلف' },
];

export default function InterduceSection({ section }: { section?: any }) {
  const titles = section?.data?.titles ?? {};
  const { title, subtitle, description } = titles;

  return (
    <section className='container-wide px-4 py-8 overflow-hidden'>
      <div className='container p-0'>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='rounded-3xl bg-gray-1 p-6 md:p-10'>
          <div className='grid gap-8 lg:grid-cols-12 lg:items-center'>
            <div className='flex flex-col gap-5 lg:col-span-7 xl:items-start items-center text-center xl:text-right'>
              {title && <h2 className='text-3xl text-primary-1'>{title}</h2>}
              {subtitle && <span className='text-xl font-medium text-secondary-black-3 sm:text-2xl'>{subtitle}</span>}
              {description && <p className='text-body text-justify text-secondary-1'>{description}</p>}
            </div>

            <div className='flex items-center justify-center lg:col-span-5'>
              <div className='flex size-40 items-center justify-center rounded-[2.5rem] bg-linear-to-l from-primary-3 to-primary-2 xl:size-56'>
                <Counter end={20} suffix='+' className='text-6xl text-custom-white xl:text-8xl' />
              </div>
            </div>
          </div>

          <div className='mt-8 grid grid-cols-1 gap-3 border-t border-gray-2 pt-8 sm:grid-cols-3'>
            {STATS.map((stat) => (
              <div key={stat.label} className='flex flex-col items-center gap-1 rounded-2xl bg-custom-white p-5'>
                <Counter end={stat.end} suffix='+' className='text-3xl text-primary-1 md:text-5xl' />
                <span className='text-center text-secondary-black-3 lg:text-[18px] lg:font-medium'>{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='group container mt-6 block'>
          <div className='w-full shrink-0 overflow-hidden rounded-3xl'>
            <InterduceImage
              desktopFileUrl={section?.data?.desktopFileUrl}
              tabletFileUrl={section?.data?.tabletFileUrl}
              mobileFileUrl={section?.data?.mobileFileUrl}
              alt={title}
              link={section?.link}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
