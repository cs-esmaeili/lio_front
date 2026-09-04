import { getImageProps } from 'next/image';
import Link from 'next/link';

type SlideItem = {
  id: number;
  src: string;
  tablet_src: string;
  mobile_src: string;
  alt: string;
  link: string;
};

type ResponsiveImageProps = {
  item: SlideItem;
  use?: 'slider' | 'leftCart';
};

// TODO: remove after test — rewrites local dev URLs to production
const normalizeUrl = (url: string) =>
  url.startsWith('http://127.0.0.1:8001/')
    ? url.replace('http://127.0.0.1:8001/', 'https://dudigram.behidopro.ir/')
    : url;

const ResponsiveImage = ({
  item,
  use = 'slider',
}: ResponsiveImageProps) => {
  const commonProps = {
    alt: item.alt || 'slider',
    sizes: '100vw',
  };

  const src = normalizeUrl(item.src);
  const tabletSrc = normalizeUrl(item.tablet_src);
  const mobileSrc = normalizeUrl(item.mobile_src);

  const desktopHeight = use === 'slider' ? 400 : 250;

  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...commonProps,
    src,
    width: 1014,
    height: desktopHeight,
  });

  const {
    props: { srcSet: tablet },
  } = getImageProps({
    ...commonProps,
    src: tabletSrc,
    width: 768,
    height: 300,
  });

  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...commonProps,
    src: mobileSrc,
    width: 361,
    height: 447,
  });

  return (
    <Link href={item.link} prefetch={false}>
      <picture>
        <source media="(max-width:768px)" srcSet={mobile} />
        <source media="(min-width:769px) and (max-width:1024px)" srcSet={tablet} />
        <source media="(min-width:1025px)" srcSet={desktop} />
        <img
          {...rest}
          className="w-full h-full object-cover object-center"
          alt={item.alt || 'slider'}
        />
      </picture>
    </Link>
  );
};

export default ResponsiveImage;
