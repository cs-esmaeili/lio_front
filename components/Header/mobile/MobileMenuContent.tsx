'use client';

import Link from 'next/link';
import CategoryAccordion from '@/components/Header/mobile/CategoryAccordion';
import type { HeaderData } from '@/typescript/types/header/header.types';
import type { MenuItem } from '@/typescript/schemas/header/menu.schema';

function getHref(item: MenuItem): string {
  return item.link?.startsWith('/') ? item.link : `/${item.link}`;
}

export default function MobileMenuContent({ headerData }: { headerData: HeaderData }) {
  const menuItems = headerData?.header ?? [];

  const directLinks = menuItems.filter((item) => !item.sub_menus?.length);

  const accordionItems = menuItems.filter((item) => (item.sub_menus?.length ?? 0) > 0);

  return (
    <div className='px-0'>
      {directLinks.length > 0 && (
        <div className='overflow-hidden rounded-3xl border border-gray-2 bg-custom-white'>
          {directLinks.map((item, index) => (
            <Link
              key={item.id}
              href={getHref(item)}
              className={`
                flex items-center
                min-h-[53px]
                px-6
                text-sm
                font-medium
                text-secondary-1
                transition-colors
                hover:text-primary-1
                ${index !== directLinks.length - 1 ? 'border-b border-gray-2' : ''}
              `}>
              {item.title}
            </Link>
          ))}
        </div>
      )}

      {accordionItems.length > 0 && (
        <div className='mt-6'>
          <h5 className='mb-3 px-2 text-sm font-semibold text-secondary-black-3'>دسته بندی های سایت</h5>

          <CategoryAccordion items={accordionItems} />
        </div>
      )}
    </div>
  );
}
