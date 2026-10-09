import Image from 'next/image';
import Link from 'next/link';
import { Call } from 'iconsax-reactjs';
import logo from '@/public/logo-white.png';
import Icon from '@/components/global/Icon';
import ScrollToTopButton from '@/components/Footer/ScrollToTopButton';
import type { FooterData } from '@/typescript/types/footer/footer.types';

const linkFocus =
  'rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-primary-1';

function BlockHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className='mb-4 flex items-center gap-2'>
      <span className='block h-4 w-1 rounded-full bg-primary-1' />
      <h3 className='text-base font-bold text-secondary-black-3'>{children}</h3>
    </div>
  );
}

export default function Footer({ wideContainer, footerData }: { wideContainer: boolean; footerData: FooterData }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

  const footerSections = footerData?.footer ?? [];
  const communications = footerData?.communications ?? [];
  const phone = footerData?.support_phone || footerData?.telephone || '';
  const container = wideContainer ? 'container-shop' : 'container';

  return (
    <footer className='mt-6 bg-gray-1'>
      <div className={container}>
        {/* Brand strip */}
        <div className='flex flex-col gap-6 border-b border-gray-2 py-8 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col items-center gap-4 text-center md:flex-row md:text-right'>
            <Link href='/' className={`flex items-center rounded-xl border border-gray-2 bg-custom-white px-4 py-3 ${linkFocus}`}>
              <Image src={footerData?.logo || logo} alt='logo' width={160} height={40} className='h-8 w-auto object-contain' />
            </Link>

            <div className='flex flex-col gap-1'>
              {siteName && <span className='text-base font-bold text-secondary-black-3'>{siteName}</span>}
              {footerData?.slogan && <span className='text-sm text-secondary-2'>{footerData.slogan}</span>}
            </div>
          </div>

          <div className='flex items-center justify-center gap-3'>
            {phone && (
              <a
                href={`tel:${phone}`}
                aria-label='تلفن پشتیبانی'
                className={`flex items-center gap-2 rounded-xl border border-gray-2 bg-custom-white px-4 py-2.5 text-sm font-semibold text-secondary-1 hover:border-primary-3 hover:text-primary-1 ${linkFocus}`}>
                <Icon IconComponent={Call} size={18} className='text-primary-1' variant='Linear' />
                <span>
                  تلفن پشتیبانی : <span dir='ltr'>{phone}</span>
                </span>
              </a>
            )}

            <ScrollToTopButton className='flex size-11 items-center justify-center rounded-xl bg-primary-1 text-custom-white hover:bg-primary-2' />
          </div>
        </div>

        {/* Link blocks */}
        <div className='grid gap-6 py-10 md:grid-cols-2 lg:grid-cols-12'>
          {footerSections.map((section) => {
            const subMenus = section.sub_menus ?? [];

            return (
              <div key={section.id} className='rounded-2xl border border-gray-2 bg-custom-white p-6 lg:col-span-4'>
                <BlockHeading>{section.title}</BlockHeading>

                {subMenus.length > 0 && (
                  <ul className='grid grid-cols-2 gap-x-4 gap-y-3'>
                    {subMenus.map((item) => (
                      <li key={item.id}>
                        <Link href={item.link} prefetch={false} className={`block text-sm text-secondary-1 hover:text-primary-1 ${linkFocus}`}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          {/* About + socials */}
          <div className='rounded-2xl border border-gray-2 bg-custom-white p-6 md:col-span-2 lg:col-span-4'>
            <BlockHeading>درباره {siteName}</BlockHeading>

            {footerData?.description && <p className='text-regular leading-7 text-secondary-1'>{footerData.description}</p>}

            {communications.length > 0 && (
              <div className='mt-6 flex flex-wrap items-center gap-3'>
                <span className='text-sm font-semibold text-secondary-black-3'>همراه ما باشید</span>

                <div className='flex items-center gap-2'>
                  {communications.map((comm) => (
                    <a
                      key={comm.key}
                      href={comm.full_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={comm.key}
                      className={`flex size-9 items-center justify-center rounded-lg border border-gray-2 bg-gray-1 hover:border-primary-3 hover:bg-primary-4 ${linkFocus}`}>
                      <Image src={comm.image} alt={comm.key} width={20} height={20} className='size-5 object-contain' />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className='flex flex-col-reverse items-center gap-4 border-t border-gray-2 py-5 md:flex-row md:justify-between'>
          <p className='text-center text-xs text-secondary-2 md:text-right'>کلیه حقوق این وب‌سایت متعلق به {siteName} است.</p>

          <a
            referrerPolicy='origin'
            target='_blank'
            rel='noopener noreferrer'
            href='https://trustseal.enamad.ir/?id=423483&Code=3R8cTgFzHmUvNB7PLKbc8SlOn1ErwddF'
            className={`inline-block transition-transform duration-300 hover:scale-105 ${linkFocus}`}>
            <img
              referrerPolicy='origin'
              src='https://trustseal.enamad.ir/logo.aspx?id=423483&Code=3R8cTgFzHmUvNB7PLKbc8SlOn1ErwddF'
              alt='نماد اعتماد الکترونیکی'
              className='h-14 w-auto rounded-lg'
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
