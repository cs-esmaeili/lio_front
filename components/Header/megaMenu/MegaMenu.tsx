'use client';

import { useRef, useState } from 'react';
import { HamburgerMenu } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';
import MegaMenuContent from '@/components/Header/megaMenu/MegaMenuContent';
import { useBackdropPortal } from '@/hooks/useBackdropPortal';
import type { HeaderData } from '@/typescript/types/header/header.types';

export default function MegaMenu({ headerData }: { headerData: HeaderData }) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const menuItems = headerData?.header ?? [];

  const handleOpenMenu = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    setOpen(true);
  };

  const handleCloseMenu = () => {
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  const handleCloseImmediate = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    setOpen(false);
  };

  const Backdrop = useBackdropPortal(open);

  return (
    <div className='relative flex-none' onMouseLeave={handleCloseMenu}>
      <button
        type='button'
        onMouseEnter={handleOpenMenu}
        onFocus={handleOpenMenu}
        aria-expanded={open}
        className='flex h-8 items-center gap-3 rounded-lg bg-custom-white px-4 text-xs font-semibold text-primary-black-1 transition-colors hover:text-primary-1'>
        <Icon IconComponent={HamburgerMenu} size={16} className='text-primary-1' aria-hidden='true' variant='Linear' />
        <span>دسته بندی کالا ها</span>
      </button>

      <MegaMenuContent
        activeMenu={open ? menuItems : null}
        onOpenMenu={handleOpenMenu}
        onCloseMenu={handleCloseMenu}
        onCloseImmediate={handleCloseImmediate}
      />

      {Backdrop}
    </div>
  );
}
