'use client';

import logo from '@/public/logo.webp';
import Image from 'next/image';
import SearchPopover from '@/components/Header/SearchPopover';
import CartIcon from '@/components/Header/CartIcon';
import CompareIcon from '@/components/Header/CompareIcon';
import { ShoppingBasket } from '@/components/global/Sidebars/ShoppingBasket';
import MegaMenu from '@/components/Header/megaMenu/MegaMenu';
import { useEffect, useState } from 'react';
import { useBasketUIStore } from '@/stores/basketUIStore';
import Link from 'next/link';
import MobileMenu from '@/components/Header/mobile/MobileMenu';
import UserNavButton from '@/components/Header/UserNavButton';
import { useCart } from '@/hooks/shop/useCart';
// import TrakingOrder from '@/components/Header/TrakingOrder';

import { usePathname } from 'next/navigation';
import DashboardMobileMenu from '@/components/Header/mobile/DashboardMobileMenu';
import type { Communication, HeaderData } from '@/typescript/types/header/header.types';


export default function HeaderClient({
  wideContainer,
  headerData,
  socialToAction,
}: {
  wideContainer: boolean;
  headerData: HeaderData;
  socialToAction: Communication[];
}) {
  const [isSticky, setIsSticky] = useState(false);
  const { isOpen: isBasketOpen, open: openBasket, close: closeBasket } = useBasketUIStore();
  const { refetch } = useCart();

  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith('/dashboard');

  // On mount: sync cart from server (auth) or localStorage (guest).
  // Ensures CartIcon badge is never stale and post-login state is correct.
  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`
          w-full sticky top-0 z-30
          transition-all duration-300
          ${isSticky ? 'backdrop-blur-md bg-background/90 shadow-[0_7px_12px_-10px_rgba(0,0,0,0.2)]' : ''}
        `}>
        <div className={`${wideContainer ? 'container-shop' : 'container'} mx-auto my-0 pb-0 lg:pb-2 ${isSticky && 'py-0! lg:py-0!'}`}>
          <div className={`flex flex-row items-center justify-between relative -mt-2 sm:mt-2 xl:mt-4 ${isSticky && 'py-2 xl:py-0 sm:mt-0'}`}>
            <div className='flex-1 flex justify-start items-center'>
              

            {isDashboardRoute ? 
              <div className='flex-1 md:flex-4 justify-start block md:hidden px-3'>
                <DashboardMobileMenu  />
              </div>
              : 
              <>
                <Link href='/' prefetch>
                  <Image
                    className={`mb-5 ${isSticky && 'mb-0! h-10 transition-all'}`}
                    width={138}
                    height={72}
                    src={headerData?.logo || logo}
                    alt='logo'
                    fetchPriority='high'
                    loading='eager'
                  />
                </Link>
                <div className='flex-1 md:flex-4 justify-start hidden md:block xl:hidden px-3'>
                  <MobileMenu headerData={headerData} />
                </div>
              </>
            }

 
            </div>

            <div className={`flex-1 xl:flex-4 justify-center hidden xl:flex ${isSticky && 'pt-2'}`}>
              <MegaMenu headerData={headerData} socialToAction={socialToAction} />
            </div>

            <div className='flex-1 flex justify-end gap-2'>
              {/* footerData-dependent tracking order — commented for now */}
              {/* <TrakingOrder footerData={footerData} /> */}
              <SearchPopover />
              <CartIcon onClick={openBasket} />
              <CompareIcon />
              <UserNavButton />
            </div>
          </div>
        </div>
      </header>

      <ShoppingBasket isOpen={isBasketOpen} onClose={closeBasket} />
    </>
  );
}
