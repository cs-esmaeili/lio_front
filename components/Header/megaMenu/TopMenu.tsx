import Link from 'next/link';
import { getLinkPath, normalizePathname, isPathActive, getHref } from '@/utils/path';

type Props = {
  categories: any[];
  pathname: string;
  openMenu: string | null;
  onOpenMenu: (key: string) => void;
  onCloseMenu: () => void;
  onCloseImmediate: () => void;
};

export default function TopMenu({ categories, pathname, openMenu, onOpenMenu, onCloseMenu, onCloseImmediate }: Props) {
  const renderTitle = (title: string | string[], isActive: boolean) => {
    const textTop = isActive ? 'text-primary-2' : 'text-gray-400';
    const textBottom = isActive ? 'text-primary-1' : 'text-gray-800';
    if (Array.isArray(title)) {
      return (
        <div className='flex flex-col items-center leading-tight text-center gap-2 font-normal'>
          <span className={`text-sm ${textTop}`}>{title[0]}</span>

          <span className={`text-sm font-medium ${textBottom}`}>{title[1]}</span>
        </div>
      );
    }

    // Split string at first space → top / bottom lines
    const firstSpace = title.indexOf(' ');
    const top = firstSpace === -1 ? null : title.slice(0, firstSpace);
    const bottom = firstSpace === -1 ? title : title.slice(firstSpace + 1);

    return (
      <div className='flex flex-col items-center leading-tight text-center gap-2 font-normal'>
        <span className={`text-sm ${top ? textTop : 'invisible'}`}>{top || '-'}</span>
        <span className={`text-sm font-medium ${textBottom}`}>{bottom}</span>
      </div>
    );
  };

  return (
    <div className='flex justify-center gap-3'>
      {categories.map((category) => {
        const menuKey = category.link || String(category.id);
        const isActive = openMenu === menuKey;
        const linkPath = getLinkPath(category.link);
        const cleanPath = normalizePathname(pathname);
        const isRouteActive = isPathActive(linkPath, cleanPath);

        const hasSubMenus = category.sub_menus?.length > 0;

        const linkClassName = `
          border-b-2
          transition-all
          cursor-pointer
          ${isActive || isRouteActive ? 'border-primary-1' : 'border-gray-2 hover:border-primary-1'}
        `;

        const textClassName = `
          flex items-center gap-1
          text-sm font-medium
          transition-colors
          cursor-pointer
          pb-2
          ${isActive || isRouteActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}
        `;

        if (!hasSubMenus) {
          return (
            <div key={category.id} className={linkClassName}>
              <Link href={getHref(category)} onClick={onCloseImmediate} className={textClassName}>
                {renderTitle(category.title, isActive || isRouteActive)}
              </Link>
            </div>
          );
        }

        return (
          <div key={category.id} onMouseEnter={() => onOpenMenu(menuKey)} onMouseLeave={onCloseMenu} className={linkClassName}>
            <Link href={getHref(category)} onClick={onCloseImmediate} className={textClassName}>
              {renderTitle(category.title, isActive || isRouteActive)}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
