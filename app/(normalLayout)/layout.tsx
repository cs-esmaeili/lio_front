import Header from '@/components/Header/Header';
import { Toaster } from '@/components/shadcn/sonner';
import { categories } from '@/services/HeaderFooter.service';
import type { HeaderData } from '@/typescript/types/header/header.types';
// import Footer from '@/components/Footer/Footer';
// import BottomNavigation from '@/components/Footer/BottomNavigation';
// import { HeaderFooterInfo } from '@/services/HeaderFooter.service';
// import JsonLd from '@/components/seo/JsonLd';
// import organizationSchema from '@/schema/seo/organization';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const headerData: HeaderData = { header: await categories() };

  // const [headerData, footerData] = await Promise.all([HeaderFooterInfo('header'), HeaderFooterInfo('footer')]);

  // const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  // const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

  // const organizationJsonLd = organizationSchema({
  // name: siteName,
  // url: `${siteUrl}/`,
  // logo: `${siteUrl}/logo.webp`, 
  // });

  return (
    <>
      {/* <JsonLd data={organizationJsonLd} /> */}
      <Header wideContainer={false} headerData={headerData} />
      <main>{children}</main>
      {/* <Footer wideContainer={false} footerData={footerData.data} /> */}
      {/* <BottomNavigation supportPhone={footerData.data?.support_phone || footerData.data?.telephone} /> */}
      <Toaster />
    </>
  );
}
