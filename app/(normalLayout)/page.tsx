import { homePageSections } from '@/services/home.service';
import SectionsRenderer from '@/components/Home/SectionsRenderer';
import useSeo from '@/hooks/seo/useSeo';
import JsonLd from '@/components/seo/JsonLd';
import websiteSchema from '@/schema/seo/website';

// export async function generateMetadata() {
//   const data = await homeSections();
//   const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
//   const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

//   return useSeo({
//     title: `${data?.seo_details?.main_meta?.title} | ${siteName}`,
//     description: data?.seo_details?.main_meta?.description,
//     keywords: data?.seo_details?.main_meta?.keywords,
//     canonical: data?.seo_details?.main_meta?.canonical ?? `${siteUrl}/`,
//     robots: data?.seo_details?.main_meta?.robot,
//     image: data.logo,
//     imageAlt: siteName,
//   });
// }

export default async function Home() {
  const data = await homePageSections();
  const sections = data?.sections ?? [];

  console.log("sections" , sections[0].data.slides);
  
  // const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  // const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

  // const website = websiteSchema({
  //   name: siteName,
  //   url: `${siteUrl}/`,
  //   inLanguage: 'fa-IR',
  // });


  return (
    <>
      {/* <JsonLd data={website} /> */}
      <div className='flex flex-col flex-1 items-center justify-center gap-7.5 xl:gap-12.5 overflow-x-hidden'>
        <SectionsRenderer sections={sections} />
      </div>
    </>
  );
}
