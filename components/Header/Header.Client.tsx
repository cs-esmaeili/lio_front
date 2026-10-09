'use client';

import logo from '@/public/logo.webp';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Call } from 'iconsax-reactjs';

import SearchPopover from '@/components/Header/SearchPopover';
import CartIcon from '@/components/Header/CartIcon';
import CompareIcon from '@/components/Header/CompareIcon';
import MegaMenu from '@/components/Header/megaMenu/MegaMenu';
import MobileMenu from '@/components/Header/mobile/MobileMenu';
import DashboardMobileMenu from '@/components/Header/mobile/DashboardMobileMenu';
import UserNavButton from '@/components/Header/UserNavButton';
import { ShoppingBasket } from '@/components/global/Sidebars/ShoppingBasket';
import Icon from '@/components/global/Icon';

import { useCart } from '@/hooks/cart/useCart';
import { getHref } from '@/utils/path';
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
  const { isOpen, openCart, closeCart, refetch } = useCart();

  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith('/dashboard');

  const navLinks = headerData?.header ?? [];
  const supportPhone = headerData?.supportPhone || '';
  const containerClass = wideContainer ? 'container-shop' : 'container';

  // On mount: sync cart from server (auth) or localStorage (guest).
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

  const headerBg = isSticky
    ? 'bg-custom-white/95 backdrop-blur-md shadow-[0_7px_12px_-10px_rgba(0,0,0,0.2)] lg:bg-primary-4/95'
    : 'bg-custom-white lg:bg-primary-4';

  return (
    <>
      <header className={`sticky top-0 z-30 w-full transition-all duration-300 ${headerBg}`}>
        <div className={`${containerClass} pb-2 lg:pb-3`}>
          {/* First row: logo, search, actions */}
          <div className='flex h-16 items-center justify-between lg:h-auto lg:gap-6 lg:py-4'>
            <Link href='/' prefetch className='flex-none'>
              <Image
                className='h-8 w-auto lg:h-9'
                width={138}
                height={72}
                src={headerData?.logo || logo}
                alt='logo'
                fetchPriority='high'
                loading='eager'
              />
            </Link>

            {/* Desktop search bar */}
            <div className='hidden flex-1 lg:block'>
              <SearchPopover variant='bar' />
            </div>

            {/* Desktop actions */}
            <div className='hidden flex-none items-center gap-3 lg:flex'>
              <CartIcon onClick={openCart} />
              <CompareIcon />
              <UserNavButton />
            </div>

            {/* Mobile actions */}
            <div className='flex items-center gap-4 lg:hidden'>
              <CartIcon onClick={openCart} />
              {isDashboardRoute ? <DashboardMobileMenu /> : <MobileMenu headerData={headerData} />}
            </div>
          </div>

          {/* Mobile search bar */}
          <div className='lg:hidden'>
            <SearchPopover variant='bar' />
          </div>

          {/* Desktop navigation row */}
          <div className='mt-3 hidden lg:flex lg:items-center lg:gap-10'>
            <MegaMenu headerData={headerData} socialToAction={socialToAction} />

            <nav className='flex flex-1 items-center gap-8 overflow-x-auto whitespace-nowrap pb-2'>
              {navLinks.map((item) => (
                <Link
                  key={item.id}
                  href={getHref(item)}
                  className='text-xs font-semibold leading-7 text-secondary-black-3 transition-colors hover:text-primary-1'>
                  {item.title}
                </Link>
              ))}
            </nav>

            {supportPhone && (
              <a
                href={`tel:${supportPhone}`}
                aria-label='تماس با پشتیبانی'
                className='flex h-8 flex-none items-center gap-2 rounded-lg bg-primary-1 px-4 text-custom-white transition-colors hover:bg-primary-2'>
                <Icon IconComponent={Call} size={18} className='text-custom-white' />
                <span dir='ltr' className='text-sm font-semibold'>
                  {supportPhone}
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Mobile navigation row */}
        <div className={`${containerClass} lg:hidden`}>
          <div className='flex items-center gap-2.5 pb-1 text-[13px] font-semibold text-secondary-black-3'>
            {navLinks.slice(0, 5).map((item) => (
              <Link key={item.id} href={getHref(item)} className='flex items-center py-2'>
                {item.title}
              </Link>
            ))}

            {supportPhone && (
              <a
                href={`tel:${supportPhone}`}
                aria-label='تماس با پشتیبانی'
                className='mr-auto flex h-8 w-10 flex-none items-center justify-center rounded-lg bg-primary-1 text-custom-white'>
                <Icon IconComponent={Call} size={18} className='text-custom-white' />
              </a>
            )}
          </div>
        </div>
      </header>

      <ShoppingBasket isOpen={isOpen} onClose={closeCart} />
    </>
  );
}
