import { Suspense } from 'react';
import Shop from '@/components/shop/List/Shop';
import { productListSSR, productFiltersSSR } from '@/services/shop.service';
import useSeo from '@/hooks/seo/useSeo';
import { getFooterData } from '@/services/HeaderFooter.service';
import JsonLd from '@/components/seo/JsonLd';
import shopSchema from '@/schema/seo/shop';

export async function generateMetadata() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

  return useSeo({
    title: `محصولات | ${siteName}`,
    description: 'فروشگاه آنلاین دودی گرام',
    canonical: `${siteUrl}/shop/`,
    robots: 'index,follow',
    image: `${siteUrl}/logo.webp`,
    imageAlt: 'محصولات دودی گرام',
  });
}

const page = async ({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) => {
  const sp = await searchParams;

  const [serverFilters, searchResult] = await Promise.all([productFiltersSSR(null), productListSSR(null, sp)]);

  const shopJsonLd = shopSchema({
    name: 'فروشگاه آنلاین دودی گرام',
    description: 'محصولات فروشگاه آنلاین دودی گرام',
    url: `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/shop/`,
  });

  const footer = await getFooterData();
  const callToAction = footer.support_phone || footer.telephone || '';
  const socialToAction = footer.communications || [];

  return (
    <>
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
