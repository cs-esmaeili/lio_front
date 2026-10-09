import { getImageProps } from 'next/image';
import Link from 'next/link';

type BannerItem = {
  title: string;
  subtitle: string;
  buttonTitle: string;
  buttonUrl: string;
  desktopFileUrl: string;
  tabletFileUrl: string;
  mobileFileUrl: string;
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
  const common = { alt: item.title || '', sizes: '100vw' };

  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: normalizeUrl(item.desktopFileUrl), width: desktopW, height: desktopH });

  const {
    props: { srcSet: tablet },
  } = getImageProps({ ...common, src: normalizeUrl(item.tabletFileUrl), width: tabletW, height: tabletH });

  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: normalizeUrl(item.mobileFileUrl), width: mobileW, height: mobileH });

  const picture = (
    <picture>
      <source media='(max-width:768px)' srcSet={mobile} />
      <source media='(min-width:769px) and (max-width:1024px)' srcSet={tablet} />
      <source media='(min-width:1025px)' srcSet={desktop} />
      <img {...rest} className='w-full h-full object-cover' alt={item.title || ''} />
    </picture>
  );

  if (item.buttonUrl) {
    return (
      <Link href={item.buttonUrl} className='block w-full h-full'>
        {picture}
      </Link>
    );
  }

  return picture;
}

export default function ThreeBannerSection({ section }: { section?: any }) {
  const banners: BannerItem[] = section?.data?.banners ?? [];

  // Equal three-up columns; dims only shape the generated srcset.
  const dims = [
    { desktopW: 640, desktopH: 420, tabletW: 512, tabletH: 420, mobileW: 360, mobileH: 220 },
    { desktopW: 640, desktopH: 420, tabletW: 512, tabletH: 420, mobileW: 360, mobileH: 220 },
    { desktopW: 640, desktopH: 420, tabletW: 512, tabletH: 420, mobileW: 360, mobileH: 220 },
  ];

  return (
    <section className='container'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6'>
        {banners.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className='group relative h-[190px] overflow-hidden rounded-3xl md:h-[260px] lg:h-[340px]'>
            <div className='h-full w-full transition-transform duration-700 ease-in-out group-hover:scale-105'>
              <BannerImage item={item} {...dims[index]} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
