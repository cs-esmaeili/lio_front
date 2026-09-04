import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BottomNavigation from '@/components/Footer/BottomNavigation';
import { Toaster } from '@/components/shadcn/sonner';
import { HeaderFooterInfo } from '@/services/HeaderFooter.service';


export default async function MainLayout({ children }: { children: React.ReactNode }) {

  const [headerData, footerData] = await Promise.all([HeaderFooterInfo('header'), HeaderFooterInfo('footer')]);

  return (
    <>
      <Header wideContainer={false} headerData={headerData.data} footerData={footerData.data} />
      <main>{children}</main>
      <BottomNavigation supportPhone={footerData.data?.support_phone || footerData.data?.telephone} />
      <Toaster />
    </>
  );
}
