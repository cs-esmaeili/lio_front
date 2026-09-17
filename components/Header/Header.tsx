import Icon from '@/components/global/Icon';
import { Star } from 'iconsax-reactjs';
import HeaderClient from './Header.Client';
import type { Communication, HeaderData } from '@/typescript/types/header/header.types';
import type { FooterData } from '@/typescript/types/footer/footer.types';


export default function Header({ wideContainer, headerData, footerData }: { wideContainer: boolean; headerData: HeaderData; footerData?: FooterData }) {

  const socialToAction: Communication[] = footerData?.communications ?? [];

  return (
    <>
      <div className={`${wideContainer ? 'container-shop' : 'container'} relative z-30 lg:py-0`}>
        <div className='hidden md:flex items-center flex-row justify-end md:justify-between gap-2 py-0 lg:pt-2'>
          <div className='flex items-center justify-center gap-2'>
            <Icon
              IconComponent={Star}
              className='text-secondary-black-3'
              size={24}
              aria-hidden='true'
              variant='TwoTone'
              toneTwoColor='--color-primary-1'
            />
            <span className='text-secondary-2 text-caption font-normal text-xs'>دودیگرام بزرگترین پلتفرم آنلاین فروش دخانیات</span>
          </div>
          {/* footerData-dependent support phone — commented for now
          <div className='flex items-center justify-center gap-1 lg:gap-2'>
            <span className='text-secondary-black-2 text-regular'>تماس با پشتیبانی</span>
            <a
              href={`tel:${footerData?.support_phone || footerData?.telephone || ''}`}
              dir='ltr'
              className='font-medium text-secondary-black-2 text-sm md:text-regular'
              aria-label='تماس با پشتیبانی'>
              {footerData?.support_phone || footerData?.telephone || ''}
            </a>
            <Icon
              IconComponent={Timer1}
              className='text-primary-1'
              size={24}
              aria-hidden='true'
              variant='TwoTone'
              toneTwoColor='--color-secondary-black-3'
            />
          </div>
          */}
        </div>
      </div>
      <HeaderClient wideContainer={wideContainer} headerData={headerData} socialToAction={socialToAction} />
    </>
  );
}
