'use client';

import Link from 'next/link';
import CategoryAccordion from '@/components/Header/mobile/CategoryAccordion';

type Props = {
  headerData: any;
};

function getHref(item: any): string {
  return item.link?.startsWith('/') ? item.link : `/${item.link}`;
}

export default function MobileMenuContent({ headerData }: Props) {
  const menuItems = headerData?.header ?? [];

  const directLinks = menuItems.filter(
    (item: any) => !item.sub_menus?.length
  );

  const accordionItems = menuItems.filter(
    (item: any) => item.sub_menus?.length > 0
  );

  return (
    <div className='px-0'>

      {directLinks.length > 0 && (
        <div className='overflow-hidden rounded-3xl bg-secondary-black-1'>
          {directLinks.map((item: any, index: number) => (
            <Link
              key={item.id}
              href={getHref(item)}
              className={`
                flex items-center
                min-h-[53px]
                px-6
                text-sm
                font-medium
                text-white
                transition-colors
                hover:text-primary-1
                ${
                  index !== directLinks.length - 1
                    ? 'border-b border-black'
                    : ''
                }
              `}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}


      {accordionItems.length > 0 && (
        <div className='mt-6'>
          <h5 className='mb-3 px-2 text-sm font-semibold text-white'>
            دسته بندی های سایت
          </h5>

          <CategoryAccordion items={accordionItems} />
        </div>
      )}
    </div>
  );
}