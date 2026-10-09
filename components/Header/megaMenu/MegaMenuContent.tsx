import Link from 'next/link';
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

export default function MegaMenuContent({
  activeMenu,
  onOpenMenu,
  onCloseMenu,
  onCloseImmediate,
  socialToAction,
}: Props) {
  // Only real categories (items with sub menus) belong in the mega panel.
  const categories = (activeMenu ?? []).filter(hasChildren);

  if (categories.length === 0) return null;

  return (
    <div
      className='absolute right-0 top-full z-50 mt-2 max-h-[75vh] w-[64rem] max-w-[95vw] overflow-y-auto rounded-lg border border-gray-2 bg-custom-white shadow-xl animate-in fade-in-0 zoom-in-95 duration-200'
      onMouseEnter={onOpenMenu}
      onMouseLeave={onCloseMenu}>
      <div className='grid grid-cols-2 gap-x-6 gap-y-6 p-6 md:grid-cols-3 lg:grid-cols-5'>
        {categories.map((category) => (
          <div key={category.id} className='flex flex-col'>
            <Link
              href={getHref(category)}
              onClick={onCloseImmediate}
              className='mb-3 border-b border-gray-2 pb-2 text-sm font-semibold text-secondary-black-3 transition-colors hover:text-primary-1'>
              {category.title}
            </Link>

            <ul className='flex flex-col gap-2.5'>
              {category.sub_menus.map((sub) => (
                <li key={sub.id} className='flex flex-col'>
                  <Link
                    href={getHref(sub)}
                    onClick={onCloseImmediate}
                    className='text-xs font-medium text-secondary-1 transition-colors hover:text-primary-1'>
                    {sub.title}
                  </Link>

                  {hasChildren(sub) && (
                    <ul className='mt-1.5 flex flex-col gap-1.5 border-r border-gray-2 pr-2.5'>
                      {sub.sub_menus.map((leaf) => (
                        <li key={leaf.id}>
                          <Link
                            href={getHref(leaf)}
                            onClick={onCloseImmediate}
                            className='block text-xs text-secondary-2 transition-colors hover:text-primary-1'>
                            {leaf.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* support box */}
      <div className={`mx-6 mb-6 flex items-center justify-between rounded-lg px-4 py-5 ${megaStyle.cardWrapper}`}>
        <div className='text-sm text-secondary-1'>پشتیبانی سفارش از طریق:</div>
        <div className='flex items-center gap-4'>
          <CallSocial communications={socialToAction} />
        </div>
      </div>
    </div>
  );
}
