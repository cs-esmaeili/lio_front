import { Suspense } from 'react';
import PageTitle from '@/components/global/PageTitle';
import Gradient from '@/components/global/Gradient';
import { brandsListSSR } from '@/services/brands.service';
import { BrandsPagination } from './BrandsPagination';
import useSeo from '@/hooks/seo/useSeo';
import JsonLd from '@/components/seo/JsonLd';
import brandsSchema from '@/schema/seo/brands';

export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;

  const { data } = await brandsListSSR(currentPage);

  const seo = data?.seo;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;
  return useSeo({
    title: `${seo?.title || 'برندهای دودیگرام'} | ${siteName}`,
    description: seo?.description,
    keywords: seo?.keywords,
    canonical: seo?.canonical ?? `${siteUrl}/brands/`,
    robots: seo?.robot,
    image: `${siteUrl}/logo.webp`,
    imageAlt: seo?.title || 'برندهای دودیگرام',
  });
}

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;
  const { data } = await brandsListSSR(currentPage);

  const brands = data?.brands ?? [];
  const links = data?.links ?? { current_page: 1, last_page: 1 };

  const seo = data?.seo;

  const description = seo?.description || 'مشاهده تمامی برندهای موجود در فروشگاه دودیگرام.';

  const brandsJsonLd = brandsSchema({
    name: seo?.title || 'برندهای دودیگرام',
    description,
    url: `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/brands/`,
  });

  return (
    <>
      <JsonLd data={brandsJsonLd} />
      <Gradient />
      <div className='container max-sm:p-0 my-6'>
        <PageTitle title='برندهای دودیگرام' />

        <Suspense fallback={null}>
          <BrandsPagination
            initialBrands={brands}
            initialPagination={{
              current_page: links.current_page,
              last_page: links.last_page,
            }}
          />
        </Suspense>
      </div>
    </>
  );
}
