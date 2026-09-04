import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import BottomNavigation from "@/components/Footer/BottomNavigation";
import { Toaster } from "@/components/shadcn/sonner";
import { HeaderFooterInfo } from "@/services/HeaderFooter.service";
import JsonLd from '@/components/seo/JsonLd';
import organizationSchema from '@/schema/seo/organization';



export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerData, footerData] = await Promise.all([
    HeaderFooterInfo("header"),
    HeaderFooterInfo("footer"),
  ]);

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;
  
    const organizationJsonLd = organizationSchema({
    name: siteName,
    url: `${siteUrl}/`,
    logo: headerData.data.logo, 
    });
  

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <Header wideContainer={true} headerData={headerData.data} footerData={footerData.data} />
      <main className="flex flex-col gap-3.5">{children}</main>
      <Footer wideContainer={true} footerData={footerData.data} />
      <BottomNavigation supportPhone={footerData.data?.support_phone || footerData.data?.telephone} />
      <Toaster />
    </>
  );
}
