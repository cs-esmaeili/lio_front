import { Suspense } from 'react';
import { MagClient } from '@/components/article/MagClient';
import Gradient from '@/components/global/Gradient';
import { postListSSR } from '@/services/blog.service';
import useSeo from '@/hooks/seo/useSeo';
import blogSchema from '@/schema/seo/blog';
import JsonLd from '@/components/seo/JsonLd';
import { BreadCrumpGenerator } from '@/components/global/BreadCrumpGenerator';
import breadcrumbSchema from '@/schema/seo/breadcrumb';
import type { BreadcrumbItem } from '@/typescript/types/general/breadcrumb';

export async function generateMetadata() {
  const res = await postListSSR(1);

  const seo = res?.data?.seo;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;
  return useSeo({
    title: `${seo?.title} | ${siteName}`,
    description: seo?.description,
    keywords: seo?.keywords,
    canonical: seo?.canonical ?? `${siteUrl}/blog/`,
    robots: seo?.robot,
    image: `${siteUrl}/logo.webp`,
    imageAlt: seo?.title,
    type: 'article',
  });
}

// ─── Page (SSR) ────────────────────────────────────────────────────────────────

export default async function DodiyMagPage() {
  const res = await postListSSR(1);
  const posts = res?.data?.posts ?? [];
  const links = res?.data?.links ?? { current_page: 1, last_page: 1 };
  const seo = res?.data?.seo;
  const breadcrumbItems: BreadcrumbItem[] = res?.data?.breadcrumb ?? [];
  const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems);

  const blogJsonLd = blogSchema({
    name: seo.title,
    description: seo?.description,
    url: `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/blog/`,
  });

  const firstFive = posts.slice(0, 5);
  const restPosts = posts.slice(5);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={blogJsonLd} />
      <Gradient />
      <section className='container'>
        <BreadCrumpGenerator items={breadcrumbItems} />
        <div className='flex flex-col gap-[24px] mb-[32px]'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-secondary-black-1'>دودی‌مگ</h1>
          </div>
        </div>
        <Suspense fallback={null}>
          <MagClient firstFive={firstFive} restPosts={restPosts} links={links} />
        </Suspense>
      </section>
    </>
  );
}
