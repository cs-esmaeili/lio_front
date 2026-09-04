import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BottomNavigation from '@/components/Footer/BottomNavigation';
import { Toaster } from '@/components/shadcn/sonner';
import { HeaderFooterInfo } from '@/services/HeaderFooter.service';
import JsonLd from '@/components/seo/JsonLd';
import organizationSchema from '@/schema/seo/organization';


export default async function MainLayout({ children }: { children: React.ReactNode }) {

  const [headerData, footerData] = await Promise.all([HeaderFooterInfo('header'), HeaderFooterInfo('footer')]);

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

  const organizationJsonLd = organizationSchema({
  name: siteName,
  url: `${siteUrl}/`,
  logo: `${siteUrl}/logo.webp`, 
  });

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <Header wideContainer={false} headerData={headerData.data} footerData={footerData.data} />
      <main>{children}</main>
      <Footer wideContainer={false} footerData={footerData.data} />
      <BottomNavigation supportPhone={footerData.data?.support_phone || footerData.data?.telephone} />
      <Toaster />
    </>
  );
}
