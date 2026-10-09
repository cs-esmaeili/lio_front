import Link from 'next/link';
import styles from '@/styles/modules/home.module.css';
import megaStyle from '@/styles/modules/borders/megaMenu.module.css';
import CallSocial from '@/components/global/CallSocial';
import type { MenuItem } from '@/typescript/schemas/header/menu.schema';
import type { Communication } from '@/typescript/types/header/header.types';

type Props = {
  activeMenu: MenuItem[] | null;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onCloseImmediate: () => void;
  socialToAction: Communication[];
};

function getHref(item: MenuItem): string {
  return item.link?.startsWith('/') ? item.link : `/${item.link}`;
}

function hasChildren(item: MenuItem): boolean {
  return Array.isArray(item.sub_menus) && item.sub_menus.length > 0;
}

function SubMenuTree({
  items,
  onCloseImmediate,
}: {
  items: MenuItem[];
  onCloseImmediate: () => void;
}) {
  return (
    <div className='mt-1 flex flex-row flex-wrap gap-x-3 gap-y-2'>
      {items.map((item) => (
        <div key={item.id} className='flex flex-col gap-1'>
          <Link
            href={getHref(item)}
            onClick={onCloseImmediate}
            className='block text-xs text-secondary-2 transition-all hover:text-primary-1'>
            {item.title}
          </Link>

          {hasChildren(item) && (
            <div className='mr-1 border-r border-gray-2 pr-3'>
              <SubMenuTree items={item.sub_menus} onCloseImmediate={onCloseImmediate} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function MegaMenuContent({
  activeMenu,
  onOpenMenu,
  onCloseMenu,
  onCloseImmediate,
  socialToAction,
}: Props) {
  if (!activeMenu) return null;

  return (
    <div
      className='absolute right-0 top-full z-50 mt-2 max-h-[70vh] w-[63rem] max-w-[95vw] overflow-y-auto rounded-lg border border-gray-2 bg-custom-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200'
      onMouseEnter={onOpenMenu}
      onMouseLeave={onCloseMenu}>
      <div className='columns-2 gap-x-6 md:columns-3 lg:columns-4'>
        {activeMenu.map((item) => (
          <div key={item.id} className='mb-3 flex break-inside-avoid flex-col gap-2'>
            <Link
              href={getHref(item)}
              onClick={onCloseImmediate}
              className={`${styles.bulletPoint} block text-sm font-medium text-secondary-black-3 transition-all hover:text-primary-1`}>
              {item.title}
            </Link>

            {hasChildren(item) && <SubMenuTree items={item.sub_menus} onCloseImmediate={onCloseImmediate} />}
          </div>
        ))}
      </div>

      {/* support box */}
      <div className={`relative mt-6 flex items-center justify-between rounded-lg px-4 py-5 ${megaStyle.cardWrapper}`}>
        <div className='text-sm text-secondary-1'>پشتیبانی سفارش از طریق:</div>
        <div className='flex items-center gap-4'>
          <CallSocial communications={socialToAction} />
        </div>
      </div>
    </div>
  );
}
