import AboutUsHeader from '@/components/about-us/AboutUsHeader';
import AboutUsHistory from '@/components/about-us/AboutUsHistory';
import AboutUsCounter from '@/components/about-us/AboutUsCounter';
import AboutUsFounder from '@/components/about-us/AboutUsFounder';
import { BreadCrumpGenerator } from '@/components/global/BreadCrumpGenerator';
import Gradient from '@/components/global/Gradient';
import { aboutData } from '@/services/aboutUs.service';
import useSeo from '@/hooks/seo/useSeo';
import type { BreadcrumbItem } from '@/typescript/types/general/breadcrumb';

function stripHtml(value: string | null | undefined): string | undefined {
  const text = value
    ?.replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text || undefined;
}

export async function generateMetadata() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

  const about = await aboutData().catch(() => null);

  return useSeo({
    title: `درباره ما | ${siteName}`,
    description: stripHtml(about?.headerDescription) ?? `آشنایی با ${siteName}، تاریخچه و ارزش‌های ما.`,
    canonical: `${siteUrl}/about-us/`,
    image: about?.headerFileUrl ?? undefined,
    imageAlt: `درباره ${siteName}`,
  });
}

export default async function Page() {
  const about = await aboutData();

  const breadcrumbItems: BreadcrumbItem[] = [
    { id: 1, position: 1, title: 'صفحه نخست', disabled: false, href: '/' },
    { id: 2, position: 2, title: 'درباره ما', disabled: true, href: '/about-us/' },
  ];

  const statistics = about.statistics.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: null,
    number: item.number,
  }));

  return (
    <>
      <Gradient />
      <div className='container'>
        <div className='flex flex-col gap-2 mb-4 sm:mb-4'>
          <BreadCrumpGenerator items={breadcrumbItems} />
        </div>

        <AboutUsHeader title={about.headerTitle ?? undefined} description={about.headerDescription ?? undefined} image={about.headerFileUrl ?? undefined} />

        <AboutUsHistory title={about.historyTitle ?? undefined} description={about.historyDescription ?? undefined} />

        <AboutUsCounter statistics={statistics} title='آمار ما' />

        <AboutUsFounder
          title={about.founderTitle ?? undefined}
          subtitle={about.founderSubtitle ?? undefined}
          description={about.founderDescription ?? undefined}
          image={about.founderFileUrl ?? undefined}
          signature={about.founderSignatureFileUrl ?? undefined}
        />
      </div>
    </>
  );
}
