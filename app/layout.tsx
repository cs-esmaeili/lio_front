import localFont from 'next/font/local';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { HeaderFooterInfo } from '@/services/HeaderFooter.service';
import { AuthListener } from '@/components/global/AuthListener';
import Script from 'next/script';
import { isSeoEnabled, SEO_DEFAULT_ROBOTS } from '@/lib/seo';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';

const yekanBakh = localFont({
  src: '../fonts/YekanBakhFaNum-VF.ttf',
  display: 'swap',
});

const rajdhani = localFont({
  src: '../fonts/Rajdhani-Light.woff2',
  variable: '--font-rajdhani',
  weight: '300',
  style: 'normal',
  display: 'swap',
});

const dastnevis = localFont({
  src: '../fonts/Dastnevis.ttf',
  variable: '--font-dastnevis',
  weight: '300',
  style: 'normal',
  display: 'swap',
});

export const metadata: Metadata = {
  robots: isSeoEnabled() ? SEO_DEFAULT_ROBOTS : 'noindex, nofollow',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerData = await HeaderFooterInfo('header').catch(() => null);
  const faviconUrl = headerData?.data?.favicon ?? null;

  return (
    <html lang='fa' dir='rtl' className={cn('overflow-x-hidden', yekanBakh.className, rajdhani.variable, dastnevis.variable)}>
      <body className='[scrollbar-gutter:stable]'>
        {faviconUrl && <link rel='icon' href={faviconUrl} />}
        <AuthListener />

        <Script src='https://www.googletagmanager.com/gtag/js?id=G-5J1LNRS3YW' strategy='afterInteractive' />

        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5J1LNRS3YW');
          `}
        </Script>
        <NextTopLoader color='#BB8B50' showSpinner={false}/>

        {children}
      </body>
    </html>
  );
}
