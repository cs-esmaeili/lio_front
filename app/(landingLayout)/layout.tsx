import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BottomNavigation from '@/components/Footer/BottomNavigation';
import { Toaster } from '@/components/shadcn/sonner';
import { getFooterData, getHeaderData } from '@/services/HeaderFooter.service';


export default async function MainLayout({ children }: { children: React.ReactNode }) {

  const [headerData, footerData] = await Promise.all([getHeaderData(), getFooterData()]);

  return (
    <>
      <Header wideContainer={false} headerData={headerData} footerData={footerData} />
      <main>{children}</main>
      <BottomNavigation supportPhone={footerData.support_phone || footerData.telephone} />
      <Toaster />
    </>
  );
}
