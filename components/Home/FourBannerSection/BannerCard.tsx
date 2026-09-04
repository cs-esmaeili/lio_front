import { getImageProps } from 'next/image';
import Link from 'next/link';
import Icon from '@/components/global/Icon';
import { ArrowLeft } from 'iconsax-reactjs';

export interface BannerItem {
  src: string;
  mobile_src: string;
  tablet_src: string;
  titleEn: string;
  titleFa: string;
  link: string;
  active?: boolean;
  onHover?: () => void;
  isMobile?: boolean;
}

// TODO: remove after test — rewrites local dev URLs to production
const normalizeUrl = (url: string) =>
  url.startsWith('http://127.0.0.1:8001/') ? url.replace('http://127.0.0.1:8001/', 'https://dudigram.behidopro.ir/') : url;

export default function BannerCard({ src, mobile_src, tablet_src, titleEn, titleFa, link, active = false, onHover, isMobile = false }: BannerItem) {
  const commonProps = { alt: titleFa, sizes: '(max-width: 768px) 50vw, 25vw' };

  const desktopSrc = normalizeUrl(src);
  const tabletSrc = normalizeUrl(tablet_src);
  const mobileSrc = normalizeUrl(mobile_src);

  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...commonProps,
    src: desktopSrc,
    width: 350,
    height: 480,
  });

  const {
    props: { srcSet: tablet },
  } = getImageProps({
    ...commonProps,
    src: tabletSrc,
    width: 192,
    height: 400,
  });

  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...commonProps,
    src: mobileSrc,
    width: 180,
    height: 180,
  });

  const renderContent = () => (
    <>
      <picture>
        <source media='(max-width:768px)' srcSet={mobile} />
        <source media='(min-width:769px) and (max-width:1024px)' srcSet={tablet} />
        <source media='(min-width:1025px)' srcSet={desktop} />
        <img
          {...rest}
          alt={titleFa}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${isMobile ? 'scale-110' : active ? 'scale-100' : 'scale-110'}`}
        />
      </picture>

      <div
        className={`absolute inset-0 bg-black/30 transition-all duration-700 ease-in-out z-1 ${
          isMobile
            ? 'backdrop-blur-[2px] bg-black/20'
            : active
              ? 'backdrop-blur-md bg-black/40 opacity-0'
              : 'backdrop-blur-md bg-black/40 opacity-100'
        }`}
      />

      <div className='absolute inset-0 flex items-center justify-center z-10'>
        <div className='relative flex items-center justify-center'>
          <span
            className={`absolute text-white font-thin text-4xl lg:text-7xl drop-shadow-lg text-center transition-all duration-700 ${
              isMobile ? 'opacity-30 scale-110' : active ? 'opacity-10 scale-110' : 'opacity-20'
            }`}>
            {titleEn}
          </span>

          <h3 className='relative text-white font-normal mt-2 drop-shadow-lg text-center'>{titleFa}</h3>
        </div>
      </div>

      {!isMobile && (
        <Link
          href={link}
          className={`h-12.5 absolute bottom-5 lg:bottom-10 left-1/2 -translate-x-1/2 z-20 transition-all duration-700 ease-in-out flex gap-2 justify-center items-center py-2 px-2 lg:px-4 rounded-[8px] select-none cursor-pointer bg-primary-4 text-primary-1 hover:rounded-[50px] hover:text-secondary-black-3 text-sm lg:text-base whitespace-nowrap ${
            active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
          <span>مشاهده محصولات</span>
          <Icon IconComponent={ArrowLeft} size={24} variant='TwoTone' />
        </Link>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Link href={link} className='block'>
        <div className='relative h-45 lg:h-120 overflow-hidden cursor-pointer'>{renderContent()}</div>
      </Link>
    );
  }

  return (
    <div onMouseEnter={onHover} className='relative h-45 lg:h-120 overflow-hidden cursor-pointer'>
      {renderContent()}
    </div>
  );
}
