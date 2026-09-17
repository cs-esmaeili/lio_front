import Icon from '@/components/global/Icon';
import Link from 'next/link';
import logo from '@/public/logo-white.png';
import behido from '@/public/behido.png';
import Image from 'next/image';
import { Star, Timer1 } from 'iconsax-reactjs';
import ScrollToTopButton from '@/components/Footer/ScrollToTopButton';
import TrackingSticky from '@/components/Footer/TrackingSticky';

import styles from '@/styles/modules/Carves.module.css';
import type { FooterData } from '@/typescript/types/footer/footer.types';

export default function Footer({ wideContainer, footerData }: { wideContainer: boolean; footerData: FooterData }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

  const footerSections = footerData?.footer ?? [];
  const communications = footerData?.communications ?? [];

  return (
    <footer className={`relative ${styles.footer} bg-secondary-black-2 mt-2.5`}>
      <TrackingSticky />

      <div className='absolute top-[-2%] md:top-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10'>
        <ScrollToTopButton />
      </div>

      <div className={`${wideContainer ? 'container-shop' : 'container'} pb-20 sm:pb-0`}>
        {/* Top bar */}
        <div className='grid sm:grid-cols-2 pt-10'>
          <div className='flex max-sm:hidden items-center'>
            <Icon IconComponent={Star} className='text-gray-1' size={24} aria-hidden='true' variant='TwoTone' toneTwoColor='--color-primary-1' />
            <div className='relative text-regular text-gray-1 pr-1 font-normal'>دودیگرام بزرگترین پلتفرم آنلاین فروش دخانیات</div>
          </div>
          <div className='flex items-center justify-center max-md:mt-6 md:justify-end text-regular text-gray-2'>
            <span className='pl-2'>تماس با پشتیبانی</span>
            <a
              href={`tel:${footerData?.support_phone || footerData?.telephone || ''}`}
              className='pl-1 inline-block'
              dir='ltr'
              aria-label='تماس با پشتیبانی'>
              {footerData?.support_phone || footerData?.telephone || ''}
            </a>
            <Icon IconComponent={Timer1} variant='TwoTone' className='text-primary-1' size={24} aria-hidden='true' toneTwoColor='--color-gray-1' />
          </div>
        </div>

        {/* Middle section — dynamic footer columns + logo + about */}
        <div className='grid grid-cols-7 xl:grid-cols-8 md:gap-x-16 mt-6 xl:mt-22 mb-3 md:mb-20'>
          {/* Dynamic footer menu sections */}
          {footerSections.map((section, idx) => {
            // First section smaller, second section wider, rest full width
            const colClasses =
              idx === 0 ? 'col-span-3 md:col-span-2 xl:col-span-1' : idx === 1 ? 'col-span-4 md:col-span-3 xl:col-span-2' : 'col-span-7';

            const subMenus = section.sub_menus ?? [];

            return (
              <div key={section.id} className={colClasses}>
                <span className='text-gray-2 text-regular pb-6 block'>{section.title}</span>
                {subMenus.length > 0 &&
                  (idx === 1 ? (
                    /* Split into 2 columns for categories section */
                    <div className='grid grid-cols-2'>
                      <ul className='text-gray-1 text-regular font-light'>
                        {subMenus
                          .filter((_, i) => i % 2 === 0)
                          .map((item) => (
                            <li key={item.id} className='pb-2'>
                              <Link href={item.link} prefetch={false} className='hover:text-primary-1'>
                                {item.title}
                              </Link>
                            </li>
                          ))}
                      </ul>
                      <ul className='text-gray-1 text-regular font-light text-left'>
                        {subMenus
                          .filter((_, i) => i % 2 === 1)
                          .map((item) => (
                            <li key={item.id} className='pb-2'>
                              <Link href={item.link} prefetch={false} className='hover:text-primary-1'>
                                {item.title}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ) : (
                    <ul className='text-gray-1 text-regular font-light'>
                      {subMenus.map((item) => (
                        <li key={item.id} className='pb-2'>
                          <Link href={item.link} prefetch={false} className='hover:text-primary-1'>
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ))}
              </div>
            );
          })}

          {/* Logo + social communications */}
          <div className='col-span-7 md:col-span-2 xl:col-span-2 max-md:my-6 flex flex-col items-center'>
            <Image src={logo} alt='logo' className='mb-4' width={184} height={87} />
            <div className='flex flex-row xl:flex-col items-center justify-center gap-2 w-full'>
              {communications.map((comm) => (
                <a
                  key={comm.key}
                  className='flex items-center md:mb-2 justify-center gap-3.5'
                  href={comm.full_url}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <span className='text-gray-2 tracking-[0.25rem] hidden xl:block'>{comm.key}</span>
                  <Image src={comm.image} sizes='30' width={30} height={30} alt={comm.key} />
                </a>
              ))}
            </div>
          </div>

          {/* About section */}
          <div className='col-span-7 xl:col-span-3'>
            <div className='text-gray-1 text-regular flex justify-between w-full items-center'>
              <span className='text-regular'>{siteName}</span>
              <span className='text-regular'>{footerData?.slogan}</span>
            </div>
            {footerData?.description && <div className='text-gray-1 text-regular font-light mt-6 text-justify'>{footerData.description}</div>}
          </div>
        </div>

        {/* Bottom bar */}
        <div className='grid md:grid-cols-2 border-t-2 border-primary-1 py-8 px-10 max-md:text-center'>
          {/* <div className='md:text-left order-1 md:order-2'>
            <Image src={behido} alt='logo' className='mx-auto md:ml-0 max-md:mb-4' />
          </div>
          <span className='text-gray-1 text-xs order-2 md:order-1'>کلیه حقوق و مادی و معنوی محفوظ است 2026©</span> */}
        </div>
      </div>
    </footer>
  );
}
