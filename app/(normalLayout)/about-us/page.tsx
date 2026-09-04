import AboutUsHeader from '@/components/about-us/AboutUsHeader';
import AboutUsHistory from '@/components/about-us/AboutUsHistory';
import AboutUsCounter from '@/components/about-us/AboutUsCounter';
import AboutUsFounder from '@/components/about-us/AboutUsFounder';
import { BreadCrumpGenerator } from '@/components/global/BreadCrumpGenerator';
import Gradient from '@/components/global/Gradient';
import { aboutData } from '@/services/aboutUs.service';
import useSeo from '@/hooks/seo/useSeo';
import JsonLd from '@/components/seo/JsonLd';
import aboutSchema from '@/schema/seo/about';
import breadcrumbSchema from '@/schema/seo/breadcrumb';
import type { BreadcrumbItem } from '@/typescript/types/general/breadcrumb';

interface AboutItem {
  title: string | null;
  image: string;
  description: string;
  type: number;
  number: number | null;
  type_name?: string;
  id?: number;
  sort?: number;
}

interface StatisticItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  number?: number | null;
}

interface AboutSeo {
  robot: string;
  title: string;
  description: string;
  keywords: string;
  canonical: string | null;
}

interface AboutData {
  status: number;
  data: AboutItem[];
  seo: AboutSeo;
  breadcrumb: BreadcrumbItem[];
}

export async function generateMetadata() {
  const result = await aboutData();

  const seo = result?.seo;
  const image = result?.data?.find((item: AboutItem) => item.type === 4)?.image;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;
  return useSeo({
    title: `${seo?.title || 'درباره ما'} | ${siteName}`,
    description: seo?.description,
    keywords: seo?.keywords,
    canonical: seo?.canonical ?? `${siteUrl}/about-us/`,
    robots: seo?.robot,
    image,
    imageAlt: seo?.title || 'درباره ما',
  });
}

export default async function Page() {
  let aboutDataResult: AboutData | null = null;
  let error: Error | null = null;

  try {
    const result = await aboutData();
    aboutDataResult = result || null;
  } catch (err) {
    console.error('Error fetching about data:', err);
    error = err as Error;
  }

  const data = aboutDataResult?.data || [];
  const breadcrumbItems = aboutDataResult?.breadcrumb || [];


  const description =
    aboutDataResult?.seo?.description ||
    data
      .find((item) => item.type === 1)
      ?.description?.replace(/<[^>]+>/g, ' ')
      ?.replace(/\s+/g, ' ')
      ?.trim();
  const image = data.find((item) => item.type === 4)?.image;
  const aboutJsonLd = aboutSchema({
    name: aboutDataResult?.seo?.title || 'درباره دودیگرام',
    description,
    image,
    url: `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/about-us/`,
  });

  const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems);

  // ----- AboutUsHeaderResult -----
  const headerTitle = data.find((item: AboutItem) => item.type === 6)?.title || '';
  const headerDescription = data.find((item: AboutItem) => item.type === 1)?.description || '';
  const headerImage = data.find((item: AboutItem) => item.type === 4)?.image || '';

  const AboutUsHeaderResult = {
    title: headerTitle,
    description: headerDescription,
    image: headerImage,
  };

  // ----- AboutUsHistoryResult -----
  const historyTitle = data.find((item: AboutItem) => item.type === 7)?.title || '';
  const historyDescription = data.find((item: AboutItem) => item.type === 2)?.description || '';
  const historyImage = '';

  const AboutUsHistoryResult = {
    title: historyTitle,
    description: historyDescription,
    image: historyImage,
  };

  // ----- AboutUsFounderResult -----
  const founderMainTitle = data.find((item: AboutItem) => item.type === 8)?.title || '';
  const founderSubTitle = data.find((item: AboutItem) => item.type === 9)?.title || '';
  const founderDescription = data.find((item: AboutItem) => item.type === 3)?.description || '';
  const founderImage = data.find((item: AboutItem) => item.type === 5)?.image || '';
  const founderSignature = data.find((item: AboutItem) => item.type === 10)?.image || '';

  const founderFullTitle = founderMainTitle || founderSubTitle;

  const AboutUsFounderResult = {
    title: founderFullTitle,
    subtitle: founderSubTitle,
    description: founderDescription,
    image: founderImage,
    signature: founderSignature,
  };

  // ----- AboutUsCounterResult (آمارها) -----
  const statisticItems =
    data.filter((item: AboutItem) => item.type === 11 && item.number !== null && item.number !== undefined && item.number > 0) || [];

  const AboutUsCounterResult = {
    items: statisticItems.map((item: AboutItem) => ({
      id: item.id || 0,
      title: item.title || 'بدون عنوان',
      description: item.description || '',
      image: item.image || null,
      number: item.number || 0,
    })),
    title: 'آمار ما',
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={aboutJsonLd} />
      <Gradient />
      <div className='container'>
        <div className='flex flex-col gap-2 mb-4 sm:mb-4'>
          <BreadCrumpGenerator items={breadcrumbItems} />
        </div>
        <AboutUsHeader title={AboutUsHeaderResult.title} description={AboutUsHeaderResult.description} image={AboutUsHeaderResult.image} />

        <AboutUsHistory title={AboutUsHistoryResult.title} description={AboutUsHistoryResult.description} image={AboutUsHistoryResult.image} />

        <AboutUsCounter statistics={AboutUsCounterResult.items} title={AboutUsCounterResult.title} />

        <AboutUsFounder
          title={AboutUsFounderResult.title}
          subtitle={AboutUsFounderResult.subtitle}
          description={AboutUsFounderResult.description}
          image={AboutUsFounderResult.image}
          signature={AboutUsFounderResult.signature}
        />
      </div>
    </>
  );
}
