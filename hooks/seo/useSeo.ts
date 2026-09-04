import type { Metadata } from 'next';
import { isSeoEnabled, SEO_DEFAULT_ROBOTS } from '@/lib/seo';

type TW = NonNullable<Metadata['twitter']>;

export default function useSeo(props: any = {}): Metadata {
  if (!isSeoEnabled()) return { robots: 'noindex, nofollow' };

  const {
    title,
    description,
    keywords,
    canonical,
    image,
    imageAlt,
    robots,
    author,
    locale = 'fa_IR',
    type = 'website',
    siteName = process.env.NEXT_PUBLIC_SITE_NAME,
  } = props;

  const metadata: Metadata = {};

  if (title) {
    metadata.title = title;
  }

  if (description) {
    metadata.description = description;
  }

  if (keywords) {
    metadata.keywords = Array.isArray(keywords)
      ? keywords
      : keywords
        .split(',')
        .map((item: string) => item.trim())
        .filter(Boolean);
  }

  if (author) {
    metadata.authors = [
      {
        name: author,
      },
    ];
  }

  metadata.robots = robots?.trim() ? robots.trim() : SEO_DEFAULT_ROBOTS;

  if (canonical) {
    metadata.alternates = {
      canonical,
    };
  }

  if (title || description || image || canonical) {
    metadata.openGraph = {};

    if (title) metadata.openGraph.title = title;

    if (description) metadata.openGraph.description = description;

    if (canonical) metadata.openGraph.url = canonical;

    if (type) {
      (metadata.openGraph as Record<string, any>).type = type;
    }

    if (locale) metadata.openGraph.locale = locale;

    if (siteName) metadata.openGraph.siteName = siteName;

    if (image) {
      metadata.openGraph.images = [
        {
          url: image,
          alt: imageAlt || title || '',
        },
      ];
    }
  }

  metadata.twitter = {
    card: 'summary_large_image',
  } as TW;

  if (title) metadata.twitter.title = title;

  if (description) metadata.twitter.description = description;

  if (image) metadata.twitter.images = [image];

  return metadata;
}
