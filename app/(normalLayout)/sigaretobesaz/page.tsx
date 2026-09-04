import useSeo from '@/hooks/seo/useSeo';
import SigaretobesazPageClient from '@/components/sigaretobesaz/SigaretobesazPageClient';
import { BreadCrumpGenerator } from '@/components/global/BreadCrumpGenerator';
import breadcrumbSchema from '@/schema/seo/breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import type { BreadcrumbItem } from '@/typescript/types/general/breadcrumb';

const breadcrumbItems: BreadcrumbItem[] = [
  {
    id: 0,
    position: 0,
    title: 'خانه',
    disabled: false,
    href: '/',
  },
  {
    id: 1,
    position: 1,
    title: 'سیگارتو بساز',
    disabled: true,
    href: '/sigaretobesaz/',
  },
];

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

  return useSeo({
    title: 'سیگارتو بساز | پیشنهاد هوشمند سیگار بر اساس سلیقه شما | دودیگرام',
    description:
      'با ابزار انتخاب هوشمند دودیگرام، سیگار مناسب خود را پیدا کنید. طعم، نیکوتین، قطران و سایر ویژگی‌ها را انتخاب کنید و پیشنهادهای شخصی‌سازی‌شده دریافت کنید.',
    keywords: 'سیگارتو بساز',
    canonical: `${siteUrl}/sigaretobesaz/`,
    robots: 'index, follow',
    image: `${siteUrl}/sigarbesaz.png`,
    imageAlt: 'سیگارتو بساز',
  });
}

export default function Page() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

  const breadcrumbJsonLd = breadcrumbSchema(
    breadcrumbItems.map((item) => ({
      title: item.title,
      href: item.href ? `${siteUrl}${item.href}` : undefined,
    }))
  );

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <div className='container'>
        <BreadCrumpGenerator items={breadcrumbItems} />
      </div>

      <SigaretobesazPageClient />
    </>
  );
}
