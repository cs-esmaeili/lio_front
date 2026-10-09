'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader } from '@/components/shadcn/sheet';
import Icon from '@/components/global/Icon';
import { HamburgerMenu, CloseSquare } from 'iconsax-reactjs';
import { SidebarNavList } from '@/components/dashboard/Sidebar';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo-white.png';

export default function DashboardMobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type='button'
          className='
            flex
            size-6
            cursor-pointer
            items-center
            justify-center
            text-primary-black-1
            transition-colors
          '
          aria-label={open ? 'بستن منو' : 'باز کردن منو'}>
          <Icon
              IconComponent={open ? CloseSquare : HamburgerMenu}
              className='text-primary-black-1'
              size={24}
              aria-hidden='true'
              variant='Linear'
            />
        </button>
      </SheetTrigger>

      <SheetContent side='right' className='bg-black border-none p-7 h-screen overflow-y-auto rounded-l-3xl text-white'>
        <SheetHeader className='p-0'>
          <Link href='/'>
            <Image src={logo} alt='logo' priority width={138} height={72} />
          </Link>
        </SheetHeader>
        <div className='bg-secondary-black-1 rounded-3xl px-3'>
          <SidebarNavList variant='dark' onNavigate={() => setOpen(false)} />
        </div>
        <ul className='text-secondary-3 text-sm space-y-6 mt-2'>
          <li>
            <Link href='/'>صفحه اصلی</Link>
          </li>
          <li>
            <Link href='/contact-us/'>تماس با ما</Link>
          </li>
          <li>
            <Link href='/blog/'>دودی مگ</Link>
          </li>
          <li>
            <Link href='/sigaretobesaz/'>سیگارتو بساز</Link>
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  );
}
