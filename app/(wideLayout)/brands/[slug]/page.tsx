import { Suspense } from 'react';
import Shop from '@/components/shop/List/Shop';
import { buildQueryString } from '@/hooks/urlQuery/serverQuery';
import { brandsShopListSSR, brandsShopListFilterSSR } from '@/services/brands.service';
import { convertFilters } from '@/utils/product/ConvertFilters';
import useSeo from '@/hooks/seo/useSeo';
import JsonLd from '@/components/seo/JsonLd';
import collectionSchema from '@/schema/seo/collection';
import { HeaderFooterInfo } from '@/services/HeaderFooter.service';

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const result = await brandsShopListSSR(slug, '');

  const brand = result.brand;
  const seo = brand?.seo_field;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;
  return useSeo({
    title: seo?.meta_title || `برند ${brand?.title} | ${siteName}`,

    description: seo?.meta_description || brand?.description || `خرید محصولات برند ${brand?.title} از فروشگاه دودیگرام.`,
    keywords: seo?.keywords,
    canonical: seo?.canonical ?? `${siteUrl}/brands/${slug}/`,
    robots: seo?.robot,
    image: brand.image_path,
    imageAlt: brand.title,
  });
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

const page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const sp = await searchParams;

  const backendString = buildQueryString(sp, true);

  const [serverFilters, searchResult] = await Promise.all([brandsShopListFilterSSR(slug), brandsShopListSSR(slug, backendString)]);
  const brand = searchResult.brand;

  const jsonLd = collectionSchema({
    name: brand.title,
    description: brand.description || `مشاهده محصولات برند ${brand.title}`,
    url: `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/brands/${slug}/`,
    image: brand.image_path,
  });

  serverFilters.filters = convertFilters(serverFilters.filters);

  const footer = await HeaderFooterInfo('footer');
const callToAction = footer.data.support_phone || footer.data.telephone || '';
const socialToAction = footer.data.communications || footer.data.communications || [];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Suspense fallback={null}>
        <Shop pageInfo={searchResult} serverFilters={serverFilters} type='category' categorySlug={slug} callToAction={callToAction} socialToAction={socialToAction} />
      </Suspense>
      ;
    </>
  );
};

export default page;
