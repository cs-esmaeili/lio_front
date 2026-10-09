'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
} from '@/components/shadcn/sheet';
import Icon from '@/components/global/Icon';
import { HamburgerMenu, CloseSquare } from 'iconsax-reactjs';
import MobileMenuContent from '@/components/Header/mobile/MobileMenuContent';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo.webp';
import type { HeaderData } from '@/typescript/types/header/header.types';


export default function MobileMenu({ headerData }: { headerData: HeaderData }) {
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
          aria-label={open ? 'بستن منو' : 'باز کردن منو'}
        >
          <Icon
            IconComponent={open ? CloseSquare : HamburgerMenu}
            className='text-primary-black-1'
            size={24}
            aria-hidden='true'
            variant='Linear'
          />
        </button>
      </SheetTrigger>

      <SheetContent
        side='right'
        className='
          w-[min(100%,420px)]
          bg-gray-1
          border-none
          p-7
          h-screen
          overflow-y-auto
          rounded-l-3xl
          text-secondary-1
        '
      >
        <SheetHeader className='p-0'>
            <Link href='/'>
            <Image src={headerData?.logo || logo} alt='logo' priority width={138} height={72} />
          </Link>
        </SheetHeader>

        <MobileMenuContent headerData={headerData} />
      </SheetContent>
    </Sheet>
  );
}