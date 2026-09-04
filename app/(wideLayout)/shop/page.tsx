import { Suspense } from 'react';
import Shop from '@/components/shop/List/Shop';
import { buildQueryString } from '@/hooks/urlQuery/serverQuery';
import { productListSSR, productFiltersSSR } from '@/services/shop.service';
import { convertFilters } from '@/utils/product/ConvertFilters';
import useSeo from '@/hooks/seo/useSeo';
import { HeaderFooterInfo } from '@/services/HeaderFooter.service';
import JsonLd from '@/components/seo/JsonLd';
import shopSchema from '@/schema/seo/shop';
import breadcrumbSchema from '@/schema/seo/breadcrumb';
import type { BreadcrumbItem } from '@/typescript/types/general/breadcrumb';

export async function generateMetadata() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

  const searchResult = await productListSSR('', '');

  const seo = searchResult.seo_details?.main_meta;

  return useSeo({
    title: seo?.title ?? `محصولات | ${siteName}`,
    description: seo?.description ?? 'فروشگاه آنلاین دودی گرام',
    keywords: seo?.keywords,
    canonical: seo?.canonical ?? `${siteUrl}/shop/`,
    robots: seo?.robot ?? 'index,follow',
    image: `${siteUrl}/logo.webp`,
    imageAlt: 'محصولات دودی گرام',
  });
}

const page = async ({ searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[]>> }) => {
  const sp = await searchParams;
  const backendString = buildQueryString(sp, true);

  const [serverFilters, searchResult] = await Promise.all([productFiltersSSR(''), productListSSR('', backendString)]);

  // Normalize breadcrumb: PHP may serialize as object when array keys have gaps
  if (searchResult.breadcrumb && !Array.isArray(searchResult.breadcrumb)) {
    searchResult.breadcrumb = Object.values(searchResult.breadcrumb).sort((a: any, b: any) => a.position - b.position);
  }

  const seo = searchResult.seo_details?.main_meta;
  const breadcrumbItems: BreadcrumbItem[] =
  searchResult.breadcrumb || [];
  const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems);

  const shopJsonLd = shopSchema({
    name: seo?.title ?? 'فروشگاه آنلاین دودی گرام',
    description: seo?.description ?? 'محصولات فروشگاه آنلاین دودی گرام',
    url: `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/shop/`,
  });

  serverFilters.filters = convertFilters(serverFilters.filters);

  const footer = await HeaderFooterInfo('footer');
  const callToAction = footer.data.support_phone || footer.data.telephone || '';
  const socialToAction = footer.data.communications || footer.data.communications || [];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={shopJsonLd} />
      <Suspense fallback={null}>
        <Shop
          pageInfo={searchResult}
          serverFilters={serverFilters}
          type='shop'
          categorySlug={null}
          callToAction={callToAction}
          socialToAction={socialToAction}
        />
      </Suspense>
    </>
  );
};

export default page;
