'use client';
import Image from 'next/image';
import { getImageProps } from 'next/image';
import Link from 'next/link';
import Counter from '@/components/Home/counter';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import styles from '@/styles/modules/home.module.css';

const normalizeUrl = (url: string) =>
  url.startsWith('http://127.0.0.1:8001/') ? url.replace('http://127.0.0.1:8001/', 'https://dudigram.behidopro.ir/') : url;

type InterduceItem = {
  id: number;
  src: string;
  tablet_src: string;
  mobile_src: string;
  alt: string;
  link: string;
};

function InterduceImage({ item }: { item: InterduceItem }) {
  const commonProps = { alt: item.alt || '', sizes: '100vw' };

  const src = normalizeUrl(item.src);
  const tabletSrc = normalizeUrl(item.tablet_src);
  const mobileSrc = normalizeUrl(item.mobile_src);

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
      <img {...rest} className='w-full h-full object-cover object-bottom' alt={item.alt || ''} />
    </picture>
  );

  if (item.link) {
    return (
      <Link href={item.link} className='block w-full h-full'>
        {picture}
      </Link>
    );
  }

  return picture;
}

export default function InterduceSection({ section }: { section?: any }) {
  const { title, button_link, description, items } = section;
  const [amount, setAmount] = useState(0.35);

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth >= 1280) {
        setAmount(0.65);
      } else if (window.innerWidth >= 1024) {
        setAmount(0.55);
      } else {
        setAmount(0.35);
      }
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);
  return (
    <section className={`${styles.InteduceSection} container-wide px-4 InteduceSection py-8 overflow-hidden`}>
      <div className='container p-0'>
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            margin: '0px 0px -60px 0px',
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
          className='headerpart grid grid-cols-5 gap-6'>
          <div className='flex flex-col gap-y-6 xl:items-start items-center justify-center h-full  col-span-5 xl:col-span-2'>
            <h2 className='text-3xl text-primary-1'>{title}</h2>
            <span className='text-1xl sm:text-2xl font-medium xl:text-start text-center text-secondary-black-3'>{button_link}</span>
          </div>
          <div className='CenterPart col-span-5 xl:col-span-1'>
            <div className='m-auto h-40.75 w-40.75 xl:h-58 xl:w-58 lining-nums bg-linear-to-l from-primary-3 to-primary-2 rounded-full flex items-center justify-center'>
              <Counter end={20} suffix='+' className='text-black-2 text-6xl xl:text-8xl' />
            </div>
          </div>
          <div className='interducingDescriptin flex items-center justify-center h-full   col-span-5 xl:col-span-2'>
            <span className=' text-body text-secondary-1 text-justify'>{description}</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 1.1,
            ease: 'easeOut',
          }}
          className='divider w-full h-px bg-primary-1 my-6 lg:my-12'></motion.div>
        <motion.div
          initial={{ opacity: 0, y: 80 }} // شروع از پایین
          whileInView={{ opacity: 1, y: 0 }} // حرکت به بالا
          viewport={{
            once: true,
            margin: '0px 0px -60px 0px',
            amount: 0.4,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
          className='counterpart grid grid-cols-3 '>
          <div className='flex flex-col lg:flex-row items-center justify-center'>
            <Counter end={500} suffix='+' className='text-primary-1 text-3xl md:text-5xl' />
            <span className='title lg:mr-2 text-secondary-black-3 lg:text-[20px] lg:font-medium'>دسته محصول</span>
          </div>
          <div className='flex flex-col lg:flex-row items-center justify-center'>
            <Counter end={20000} suffix='+' className='text-primary-1 text-3xl md:text-5xl' />
            <span className='title lg:mr-2 text-secondary-black-3 lg:text-[20px] lg:font-medium'>خریدار رضایتمند</span>
          </div>
          <div className='flex flex-col lg:flex-row items-center justify-center'>
            <Counter end={5000} suffix='+' className='text-primary-1 text-3xl md:text-5xl' />
            <span className='title lg:mr-2 text-secondary-black-3 lg:text-[20px] lg:font-medium'>محصول مختلف</span>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -120 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-50px', amount: amount }}
        transition={{
          duration: 1.5,
          ease: [0.25, 0.1, 0.25, 1], // easeOutCubic مثل
        }}
        className='relative h-[25rem] md:h-[30rem] container mt-0 md:mt-40 lg:mt-12 group hidden'>
        <div className=' bannerPart flex flex-col-reverse lg:flex-row  items-center h-104 absolute top-0 right-0 w-full lg:px-0'>
          <div className='bg-primary-3 h-[12rem] xl:h-[30rem] flex flex-col items-center justify-center w-full lg:w-[38%] shrink-0 rounded-b-2xl lg:rounded-r-2xl lg:rounded-l-none'>
            <Image
              src='/test/play-cricle.svg'
              alt='play'
              width={113}
              height={113}
              className='lg:h-28.25 lg:w-28.25 h-17 w-17 transition-all ease-in-out duration-500 group-hover:scale-110'
            />

            <div className='mt-8 lg:mt-12 relative'>
              <Image
                src='/test/wecreate.svg'
                alt='we create'
                width={150}
                height={50}
                className='lg:w-37.5 w-21.75 h-auto absolute left-0 -top-5 group-hover:-top-9 z-0 transition-all ease-in-out duration-500'
              />

              <Image
                src='/test/modernity.svg'
                alt='modernity'
                width={150}
                height={50}
                className='lg:w-37.5 w-21.75 h-auto z-20 relative drop-shadow-[0_-10px_5px_#E4D1B9] group-hover:drop-shadow-[0_0_0_#E4D1B9] transition-all duration-300'
              />
            </div>
          </div>

          <div className='h-[12rem] sm:h-[20rem] lg:h-[30rem] w-full shrink-0 rounded-t-2xl lg:rounded-none overflow-hidden'>
            {items?.[0] && <InterduceImage item={items[0]} />}
          </div>
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: -120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px', amount: amount }}
        transition={{
          duration: 1.5,
          ease: [0.25, 0.1, 0.25, 1], // easeOutCubic مثل
        }}
        className='relative container mt-6 group block'>
          <div className='w-full shrink-0 rounded-2xl overflow-hidden'>
            {items?.[0] && <InterduceImage item={items[0]} />}
          </div>
      </motion.div>
      
    </section>
  );
}
