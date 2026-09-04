'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/shadcn/sheet';
import Icon from '@/components/global/Icon';
import { HamburgerMenu, CloseSquare } from 'iconsax-reactjs';
import MobileMenuContent from '@/components/Header/mobile/MobileMenuContent';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo-white.png';


export default function MobileMenu({ headerData }: { headerData: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type='button'
          className='
            flex
            items-center
            justify-center
            rounded-lg
            bg-primary-3
            w-9
            h-9
            relative
            cursor-pointer
            hover:bg-primary-3/80
            hover:rounded-full
          '
          aria-label={open ? 'بستن منو' : 'باز کردن منو'}
        >
          <Icon
            IconComponent={open ? CloseSquare : HamburgerMenu}
            className='text-secondary-black-3'
            size={24}
            aria-hidden='true'
            variant='TwoTone'
            toneTwoColor='--color-primary-1'
          />
        </button>
      </SheetTrigger>

      <SheetContent
        side='right'
        className='
          w-[min(100%,420px)]
          bg-black
          border-none
          p-7
          h-screen
          overflow-y-auto
          rounded-l-3xl
          text-white
        '
      >
        <SheetHeader className='p-0'>
            <Link href='/'>
            <Image src={logo} alt='logo' priority width={138} height={72} />
          </Link>
        </SheetHeader>

        <MobileMenuContent headerData={headerData} />
      </SheetContent>
    </Sheet>
  );
}