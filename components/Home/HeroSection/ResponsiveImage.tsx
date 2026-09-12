import { getImageProps } from 'next/image';
import Link from 'next/link';

type SlideItem = {
  id: number;
  desktopFileUrl: string;
  tabletFileUrl: string;
  mobileFileUrl: string;
  alt?: string;
  url?: string;
};

type ResponsiveImageProps = {
  item: SlideItem;
  use?: 'slider' | 'leftCart';
};


const ResponsiveImage = ({
  item,
  use = 'slider',
}: ResponsiveImageProps) => {
  const commonProps = {
    alt: item.alt || 'slider',
    sizes: '100vw',
  };

  const desktopHeight = use === 'slider' ? 400 : 250;

  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...commonProps,
    src: item.desktopFileUrl,
    width: 1014,
    height: desktopHeight,
  });

  const {
    props: { srcSet: tablet },
  } = getImageProps({
    ...commonProps,
    src: item.tabletFileUrl,
    width: 768,
    height: 300,
  });

  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...commonProps,
    src: item.mobileFileUrl,
    width: 361,
    height: 447,
  });

  const picture = (
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
  );

  if (item.url) {
    return (
      <Link href={item.url} prefetch={false}>
        {picture}
      </Link>
    );
  }

  return picture;
};

export default ResponsiveImage;
