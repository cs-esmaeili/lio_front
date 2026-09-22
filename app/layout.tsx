import localFont from 'next/font/local';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { AuthListener } from '@/components/global/AuthListener';
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
  return (
    <html lang='fa' dir='rtl' className={cn('overflow-x-hidden', yekanBakh.className, rajdhani.variable, dastnevis.variable)}>
      <body className='[scrollbar-gutter:stable]'>
        <AuthListener />
        <NextTopLoader color='#BB8B50' showSpinner={false}/>
        {children}
      </body>
    </html>
  );
}
