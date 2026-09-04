import { getImageProps } from 'next/image';
import Link from 'next/link';

type BannerItem = {
  src: string;
  tablet_src: string;
  mobile_src: string;
  alt: string;
  link: string;
};

const normalizeUrl = (url: string) =>
  url.startsWith('http://127.0.0.1:8001/') ? url.replace('http://127.0.0.1:8001/', 'https://dudigram.behidopro.ir/') : url;

function BannerImage({
  item,
  desktopW,
  desktopH,
  tabletW,
  tabletH,
  mobileW,
  mobileH,
}: {
  item: BannerItem;
  desktopW: number;
  desktopH: number;
  tabletW: number;
  tabletH: number;
  mobileW: number;
  mobileH: number;
}) {
  const common = { alt: item.alt || '', sizes: '100vw' };

  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: normalizeUrl(item.src), width: desktopW, height: desktopH });

  const {
    props: { srcSet: tablet },
  } = getImageProps({ ...common, src: normalizeUrl(item.tablet_src), width: tabletW, height: tabletH });

  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: normalizeUrl(item.mobile_src), width: mobileW, height: mobileH });

  const picture = (
    <picture>
      <source media='(max-width:768px)' srcSet={mobile} />
      <source media='(min-width:769px) and (max-width:1024px)' srcSet={tablet} />
      <source media='(min-width:1025px)' srcSet={desktop} />
      <img {...rest} className='w-full h-full object-cover' alt={item.alt || ''} />
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

export default function ThreeBannerSection({ section }: { section?: any }) {
  const items: BannerItem[] = section.items.vertical;


  // img1: 50vw desktop (~960px), 100vw mobile (~360px), height 280/180
  // img2: 30vw desktop (~576px), 60vw mobile (~216px), height 280/183
  // img3: 20vw desktop (~384px), 40vw mobile (~144px), height 280/183
  const dims = [
    { desktopW: 960, desktopH: 280, tabletW: 512, tabletH: 280, mobileW: 360, mobileH: 180 },
    { desktopW: 576, desktopH: 280, tabletW: 384, tabletH: 280, mobileW: 216, mobileH: 183 },
    { desktopW: 384, desktopH: 280, tabletW: 256, tabletH: 280, mobileW: 144, mobileH: 183 },
  ];

  return (
    <section className='container'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-[8px] md:gap-[24px]'>
        <div className='relative h-[180px] sm:h-[300px] md:h-[140px] lg:h-[200px] xl:h-[280px] rounded-xl overflow-hidden col-span-1 md:col-span-7'>
          {items?.[0] && <BannerImage item={items[0]} {...dims[0]} />}
        </div>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-[8px] md:gap-[24px] col-span-1 md:col-span-5'>
          <div className='relative h-[180px] sm:h-[300px] md:h-[140px] lg:h-[200px] xl:h-[280px] rounded-xl overflow-hidden col-span-1 md:col-span-3'>
            {items?.[1] && <BannerImage item={items[1]} {...dims[1]} />}
          </div>
          <div className='relative h-[180px] sm:h-[300px] md:h-[140px] lg:h-[200px] xl:h-[280px] rounded-xl overflow-hidden col-span-1 md:col-span-2'>
            {items?.[2] && <BannerImage item={items[2]} {...dims[2]} />}
          </div>
        </div>
      </div>
    </section>
  );
}
