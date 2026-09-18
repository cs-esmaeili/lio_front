import { Suspense } from 'react';
import Shop from '@/components/shop/List/Shop';
import { productListSSR, productFiltersSSR } from '@/services/category.service';
import useSeo from '@/hooks/seo/useSeo';
import categorySchema from '@/schema/seo/category';
import JsonLd from '@/components/seo/JsonLd';
import { getFooterData } from '@/services/HeaderFooter.service';
import breadcrumbSchema from '@/schema/seo/breadcrumb';

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

// export async function generateMetadata({ params, searchParams }: Props) {
//   const { slug } = await params;
//   const sp = await searchParams;

//   const lastSlug = slug[slug.length - 1];

//   const searchResult = await productListSSR(lastSlug, null);

//   const category = searchResult.category;
//   const breadcrumbItems = searchResult.breadcrumb || [];

//   const description = category.description
//     ?.replace(/<[^>]+>/g, ' ')
//     ?.replace(/\s+/g, ' ')
//     ?.trim();

//   const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
//   const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

//   const categoryPath = slug.join('/');

//   const defaultCanonical = `${siteUrl}/product-category/${categoryPath}/`;

//   const backendCanonical = category.seo_field?.canonical;

//   let canonical = backendCanonical || defaultCanonical;

//   let robots = category.seo_field?.robot || 'index,follow';

//   if (!backendCanonical) {
//     const page = Number(sp.page || 0);

//     const hasFilter = Object.keys(sp).some((key) => key !== 'page');

//     if (hasFilter && !page) {
//       canonical = defaultCanonical;
//       robots = 'noindex,nofollow';
//     }

//     if (page) {
//       robots = 'noindex,follow';

//       if (page === 1) {
//         canonical = defaultCanonical;
//       } else {
//         canonical = `${defaultCanonical}?page=${page}`;
//       }
//     }
//   }

//   return useSeo({
//     title: `${category.seo_field?.meta_title ?? category.title} | ${siteName}`,
//     description: category.seo_field?.meta_description ?? description,
//     keywords: category.seo_field?.keywords,
//     canonical,
//     robots,
//     image: category.image,
//     imageAlt: category.title,
//   });
// }

const page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const sp = await searchParams;

  const lastSlug = slug[slug.length - 1];

  const [serverFilters, searchResult] = await Promise.all([productFiltersSSR(lastSlug), productListSSR(lastSlug, sp)]);
    

  // if (searchResult.breadcrumb && !Array.isArray(searchResult.breadcrumb)) {
  //   searchResult.breadcrumb = Object.values(searchResult.breadcrumb).sort((a: any, b: any) => a.position - b.position);
  // }

  // const category = searchResult.category;
  // const breadcrumbItems = searchResult.breadcrumb || [];

  // const description = category.description
  //   ?.replace(/<[^>]+>/g, ' ')
  //   ?.replace(/\s+/g, ' ')
  //   ?.trim();
  // const categoryPath = slug.join('/');
  // const categoryJsonLd = categorySchema({
  //   name: category.title,
  //   description,
  //   url: `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/product-category/${categoryPath}/`,
  // });

  // const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems);

  const footer = await getFooterData();
  const callToAction = footer.support_phone || footer.telephone || '';
  const socialToAction = footer.communications || [];


  return (
    <>
      {/* <JsonLd data={breadcrumbJsonLd} /> */}
      {/* <JsonLd data={categoryJsonLd} /> */}
      <Suspense fallback={null}>
        <Shop
          pageInfo={searchResult}
          serverFilters={serverFilters}
          type='category'
          categorySlug={lastSlug}
          callToAction={callToAction}
          socialToAction={socialToAction}
        />
      </Suspense>
    </>
  );
};

export default page;
