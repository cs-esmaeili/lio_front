import Link from 'next/link';
import styles from '@/styles/modules/home.module.css';
import megaStyle from '@/styles/modules/borders/megaMenu.module.css';
import CallSocial from '@/components/global/CallSocial';

type MenuItem = {
  id: number;
  title: string;
  link: string;
  image: string | null;
  sub_menus: MenuItem[];
};

type Props = {
  activeMenu: MenuItem[] | null;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onCloseImmediate: () => void;
  socialToAction: any;
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
    <div className='flex flex-row flex-wrap gap-x-3 gap-y-2 mt-1'>
      {items.map((item) => (
        <div key={item.id} className='flex flex-col gap-1'>
          <Link
            href={getHref(item)}
            onClick={onCloseImmediate}
            className="block text-white/80 text-xs transition-all hover:text-secondary-orange"
          >
            {item.title}
          </Link>

          {hasChildren(item) && (
            <div className='pr-3 border-r border-white/10 mr-1'>
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
      className='absolute top-full left-0 right-0 p-3 w-full rounded-2xl bg-secondary-black-3 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto'
      onMouseEnter={onOpenMenu}
      onMouseLeave={onCloseMenu}
    >
      <div className='p-8'>

        <div className='columns-2 md:columns-3 lg:columns-5 gap-x-6'>
          {activeMenu.map((item) => (
            <div
              key={item.id}
              className='break-inside-avoid mb-3 flex flex-col gap-2'
            >       
              <Link href={getHref(item)} onClick={onCloseImmediate} className={`${styles.bulletPoint} block text-white text-sm transition-all`}>
              {item.title}
            </Link>

              {hasChildren(item) && (
                <SubMenuTree items={item.sub_menus} onCloseImmediate={onCloseImmediate} />
              )}
            </div>
          ))}
        </div>

        {/* support box */}
        <div
          className={`flex items-center justify-between px-4 py-5 mt-6 rounded-lg relative ${megaStyle.cardWrapper}`}
        >
          <div className='text-sm text-white'>پشتیبانی سفارش از طریق:</div>
          <div className='flex items-center gap-4'>
            <CallSocial communications={socialToAction} />
          </div>
        </div>
      </div>
    </div>
  );
}