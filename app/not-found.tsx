// import Header from '@/components/Header/Header';
// import Footer from '@/components/Footer/Footer';
// import BottomNavigation from '@/components/Footer/BottomNavigation';
// import { HeaderFooterInfo } from '@/services/HeaderFooter.service';
import LottieAnimation from '@/components/global/LottieAnimation';

export default async function NotFound() {
  // const [headerData, footerData] = await Promise.all([
  //   HeaderFooterInfo('header').catch(() => null),
  //   HeaderFooterInfo('footer').catch(() => null),
  // ]);

  return (
    <>
      {/* {headerData?.data && (
        <Header
          wideContainer={false}
          headerData={headerData.data}
          footerData={footerData?.data}
        />
      )} */}
      <main>
        <LottieAnimation src="/animations/404.json" />
      </main>
      {/* {footerData?.data && (
        <>
          <Footer wideContainer={false} footerData={footerData.data} />
          <BottomNavigation
            supportPhone={
              footerData.data?.support_phone || footerData.data?.telephone
            }
          />
        </>
      )} */}
    </>
  );
}
