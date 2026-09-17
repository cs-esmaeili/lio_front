import { BreadCrumpGenerator } from '@/components/global/BreadCrumpGenerator';
import Gradient from '@/components/global/Gradient';
import LeftCard from '@/components/Home/HeroSection/LeftCard';
import AstelamCard from '@/components/global/Cards/AstelamCard';
import DoodiContact from '@/components/global/Cards/DoodiContact';
import EditorSection from '@/components/shop/List/EditorSection';
import NewProductShopSection from '@/components/shop/single/NewProductShopSection';
import { Button } from '@/components/shadcn/button';
import { homeSections } from '@/services/home.service';
import { pageData } from '@/services/page.service';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFooterData } from '@/services/HeaderFooter.service';
import useSeo from '@/hooks/seo/useSeo';
import JsonLd from '@/components/seo/JsonLd';
import landingPageSchema from '@/schema/seo/landingPage';
import breadcrumbSchema from '@/schema/seo/breadcrumb';
import type { BreadcrumbItem } from '@/typescript/types/general/breadcrumb';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const response = await pageData(slug).catch(() => null);

  if (!response?.data) {
    return {
      title: slug,
      robots: 'noindex',
    };
  }

  const { data, seo } = response;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

  const description =
    seo?.meta_description ||
    data.short_description
      ?.replace(/<[^>]+>/g, ' ')
      ?.replace(/\s+/g, ' ')
      ?.trim() ||
    '';

  return useSeo({
    title: `${seo?.meta_title || data.title} | ${siteName}`,
    description,
    keywords: seo?.keywords || '',
    canonical: seo?.canonical || `${siteUrl}/${slug}/`,
    robots: seo?.robot || 'index,follow',
    image: `${siteUrl}/logo.webp`,
    imageAlt: data?.title,
  });
}

export default async function DynamicLandingPage({ params }: Props) {
  const { slug } = await params;

  const response = await pageData(slug).catch(() => null);

  if (!response?.data) notFound();

  const { data, breadcrumb } = response;
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/${slug}/`;
  const breadcrumbItems: BreadcrumbItem[] = breadcrumb || [];

  const description =
    data.description
      ?.replace(/<[^>]+>/g, ' ')
      ?.replace(/\s+/g, ' ')
      ?.trim() ||
    data.short_description ||
    '';

  const pageJsonLd = landingPageSchema({
    title: data.title,
    description,
    url: pageUrl,
  });
  const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems);

  const footer = await getFooterData();

  const callToAction = footer.support_phone || footer.telephone || '';

  const socialToAction = footer.communications || [];

  const homeData = await homeSections();

  const sideCards = homeData.sections.find((section: any) => section.id === 10);

  const buttons = data.buttons || [];
  const products = data.products || [];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <Gradient />

      <div className='container-shop'>
        <BreadCrumpGenerator items={breadcrumbItems} />

        <div className='space-y-20'>
          <div className='mt-2'>
            <h1 className='text-center text-secondary-1'>{data.title}</h1>

            {data.short_description && (
              <div className='text-body text-secondary-1 text-center my-6'>
                <EditorSection content={data.short_description} />
              </div>
            )}

            {buttons[0]?.title && (
              <div className='flex items-center justify-center'>
                <Link href={buttons[0].link}>
                  <Button variant='default' className='rounded-lg cursor-pointer mx-2 py-2 sm:py-4 h-fit w-33.25 sm:w-50'>
                    {buttons[0].title}
                  </Button>
                </Link>

                {buttons[1]?.title && (
                  <Link href={buttons[1].link}>
                    <Button variant='outlinePrimary' className='rounded-lg cursor-pointer mx-2 py-2 sm:py-4 h-fit w-33.25 sm:w-50'>
                      {buttons[1].title}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {products.length > 0 && (
            <NewProductShopSection section={{ products, button_link: data.all_products_link }} btnlink={data.all_products_link || '/'} />
          )}

          <div className='grid grid-cols-12 gap-6 mb-25'>
            <div className='hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col gap-4 lg:pl-6 2xl:pl-8.5'>
              <div className='sticky top-25 space-y-4'>
                <div>
                  <LeftCard data={sideCards} />
                </div>

                <AstelamCard communications={socialToAction} />

                <DoodiContact callToAction={callToAction} />
              </div>
            </div>

            <div className='col-span-12 lg:col-span-8 xl:col-span-9'>{data.description && <EditorSection content={data.description} />}</div>
          </div>
        </div>
      </div>
    </>
  );
}
