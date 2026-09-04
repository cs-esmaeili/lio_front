'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type HeaderLink = {
  id: number;
  title: string;
  link: string;
  image: string | null;
  sub_menus: any[];
};

type Props = {
  links: HeaderLink[];
};

export default function HeaderMenuLinks({ links }: Props) {
  const pathname = usePathname();

  if (!links || links.length === 0) return null;

  return (
    <>
      {links.map((item) => {
        const isActive = pathname === `/${item.link}` || pathname.includes(item.link);

        return (
          <div
            key={item.id}
            className={`
              border-b-2
              transition-all
              cursor-pointer
              ${isActive ? 'border-primary-1' : 'border-gray-2 hover:border-primary-1'}
            `}
          >
            <Link
              href={`/${item.link}`}
              className={`
                flex items-center gap-1
                text-sm font-medium
                transition-colors
                cursor-pointer
                pb-2
                ${isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}
              `}
            >
              {item.title}
            </Link>
          </div>
        );
      })}
    </>
  );
}
