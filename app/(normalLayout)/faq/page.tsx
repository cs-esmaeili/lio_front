import Gradient from '@/components/global/Gradient';
import LeftCard from '@/components/Home/HeroSection/LeftCard';
import EditorSection from '@/components/shop/List/EditorSection';

import FaqForm from '@/components/faq/FaqForm';
import { homeSections } from '@/services/home.service';
import useSeo from '@/hooks/seo/useSeo';
import faqSchema from '@/schema/seo/faq';
import JsonLd from '@/components/seo/JsonLd';
import { BreadCrumpGenerator } from '@/components/global/BreadCrumpGenerator';
import breadcrumbSchema from '@/schema/seo/breadcrumb';
import type { BreadcrumbItem } from '@/typescript/types/general/breadcrumb';

import { getFaqCategories, getFaqData } from '@/services/faq.service';

import Link from 'next/link';

type PageProps = {
  searchParams: Promise<{
    category_slug?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageProps) {
  const { category_slug: categorySlug } = await searchParams;

  const faqData = await getFaqData(categorySlug);
  const seo = faqData?.data?.seo;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;
  const canonicalUrl = categorySlug ? `${siteUrl}/faq/?category_slug=${categorySlug}` : `${siteUrl}/faq/`;

  return useSeo({
    title: seo?.title || 'سوالات متداول',
    description: seo?.description || 'سوالات متداول',
    keywords: seo?.keywords || 'سوالات متداول',
    canonical: seo?.canonical ?? canonicalUrl,
    robots: seo?.robot || 'index, follow',
    image: `${siteUrl}/logo.webp`,
    imageAlt: 'سوالات متداول',
  });
}

export default async function Page({ searchParams }: PageProps) {
  // ===============================
  // URL Parameters
  // ===============================

  const params = await searchParams;

  const categorySlug = params.category_slug;

  // ===============================
  // API Requests
  // ===============================

  const [faqData, faqCategoriesData, homeData] = await Promise.all([getFaqData(categorySlug), getFaqCategories(), homeSections()]);

  // ===============================
  // Data
  // ===============================

  const questions = faqData?.data?.questions ?? [];
  const categories = faqCategoriesData?.data?.categories;
  const sideCards = homeData.sections.find((section: any) => section.id === 10);
  const breadcrumbItems: BreadcrumbItem[] = faqData?.data?.breadcrumb ?? [];

  const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems);

  const faqJsonLd = faqSchema(questions);

  return (
    <>
      {breadcrumbJsonLd && <JsonLd data={breadcrumbJsonLd} />}
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <Gradient />

      <div className='container'>
        <BreadCrumpGenerator items={breadcrumbItems} />
        <div className='space-y-20'>
          <div className='mt-2'>
            <h1 className='text-center text-secondary-1'>سوالات متداول</h1>

            <div className='text-body text-secondary-1 text-center justify-center my-6'>
              <EditorSection content='این متن یک متن جایگزین است و در زمان اجرا متن اصلی جایگزین آن میشود. این متن یک متن جایگزین است و در زمان اجرا متن اصلی جایگزین آن میشود.' />
            </div>
          </div>

          <div className='grid grid-cols-12 gap-12 mb-25'>
            <div className='col-span-12 lg:col-span-8 xl:col-span-8'>
              <div className='flex gap-4 overflow-x-auto pb-4'>
                <Link
                  href='/faq'
                  className={`
                    shrink-0
                    rounded-full
                    border
                    px-8
                    py-3
                    transition-colors
                    ${!categorySlug ? 'bg-primary text-white border-primary' : 'border-primary text-primary hover:bg-primary hover:text-white'}
                  `}>
                  همه
                </Link>

                {categories.map((category) => {
                  const isActive = category.slug === categorySlug;

                  const href = `/faq?category_slug=${encodeURIComponent(category.slug)}`;

                  return (
                    <Link
                      key={category.slug}
                      href={href}
                      className={`
                        shrink-0
                        rounded-full
                        border
                        px-8
                        py-3
                        transition-colors
                        ${isActive ? 'bg-primary text-white border-primary' : 'border-primary text-primary hover:bg-primary hover:text-white'}
                      `}>
                      {category.title}
                    </Link>
                  );
                })}
              </div>

              <div className='rounded-2xl border border-primary-2 px-5 mt-6 space-y-4'>
                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <details key={`${question.title}-${index}`} className='group border-b border-primary-2 mb-0'>
                      <summary className='flex cursor-pointer list-none items-center justify-between gap-4 py-6 font-medium text-secondary-1'>
                        <span>{question.title}</span>

                        <span className='flex size-8 shrink-0 items-center justify-center text-2xl text-primary transition-transform group-open:rotate-45'>
                          +
                        </span>
                      </summary>

                      <div className='pb-6 pt-2 text-secondary-1'>
                        <EditorSection content={question.description} />
                      </div>
                    </details>
                  ))
                ) : (
                  <div className='rounded-2xl bg-[#F3F4F8] p-8 text-center text-secondary-1'>سوالی برای این دسته‌بندی وجود ندارد.</div>
                )}
              </div>
            </div>

            <div className='flex col-span-12 lg:col-span-4 xl:col-span-4 flex-col gap-10 lg:pl-6 2xl:pl-8.5'>
              <div className="sticky top-25 space-y-4">
                <FaqForm />

                <div className='px-8.5'>
                  <LeftCard data={sideCards} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
