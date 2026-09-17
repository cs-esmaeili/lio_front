import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import BottomNavigation from "@/components/Footer/BottomNavigation";
import { Toaster } from "@/components/shadcn/sonner";
import { getFooterData, getHeaderData } from "@/services/HeaderFooter.service";
import JsonLd from '@/components/seo/JsonLd';
import organizationSchema from '@/schema/seo/organization';



export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerData, footerData] = await Promise.all([
    getHeaderData(),
    getFooterData(),
  ]);

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;
  
    const organizationJsonLd = organizationSchema({
    name: siteName,
    url: `${siteUrl}/`,
    logo: headerData.logo, 
    });
  

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <Header wideContainer={true} headerData={headerData} footerData={footerData} />
      <main className="flex flex-col gap-3.5">{children}</main>
      <Footer wideContainer={true} footerData={footerData} />
      <BottomNavigation supportPhone={footerData.support_phone || footerData.telephone} />
      <Toaster />
    </>
  );
}
