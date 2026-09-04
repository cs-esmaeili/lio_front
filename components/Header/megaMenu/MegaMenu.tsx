'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import TopMenu from '@/components/Header/megaMenu/TopMenu';
import MegaMenuContent from '@/components/Header/megaMenu/MegaMenuContent';
import { useBackdropPortal } from '@/hooks/useBackdropPortal';

export default function MegaMenu({ headerData, socialToAction }: { headerData: any; socialToAction: any }) {
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const menuItems = headerData?.header ?? [];
  
  // open menu
  const handleOpenMenu = (key: string) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }

    setOpenMenu(key);
  };

  // close menu (debounced — for mouse leave)
  const handleCloseMenu = () => {
    closeTimeout.current = setTimeout(() => {
      setOpenMenu(null);
    }, 200);
  };

  // close immediately — for link clicks
  const handleCloseImmediate = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    setOpenMenu(null);
  };


  const activeMenu = (() => {
    if (!openMenu) return null;

    const item = menuItems.find((item: any) => {
      // match by link or by id string
      return item.link === openMenu || String(item.id) === openMenu;
    });

    return item?.sub_menus?.length ? item.sub_menus : null;
  })();

  const Backdrop = useBackdropPortal(openMenu ? true : false);

  return (
    <div className='flex gap-5 z-50'>
      <TopMenu categories={menuItems} pathname={pathname} openMenu={openMenu} onOpenMenu={handleOpenMenu} onCloseMenu={handleCloseMenu} onCloseImmediate={handleCloseImmediate} />
      <MegaMenuContent
        activeMenu={activeMenu}
        onOpenMenu={() => {
          if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
          }
        }}
        onCloseMenu={handleCloseMenu}
        onCloseImmediate={handleCloseImmediate}
        socialToAction={socialToAction}
      />
      {Backdrop}
    </div>
  );
}
