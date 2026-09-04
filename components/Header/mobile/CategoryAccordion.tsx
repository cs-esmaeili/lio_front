'use client';

import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shadcn/accordion';

type Category = {
  id: number;
  title: string;
  link: string;
  image: string | null;
  sub_menus: Category[];
};

type Props = {
  items: Category[];
};

function getHref(item: Category): string {
  return item.link?.startsWith('/') ? item.link : `/${item.link}`;
}

export default function CategoryAccordion({ items }: Props) {
  return (
    <Accordion type='single' collapsible className='w-full'>
      {items.map((item) => {
        const hasChildren =
          Array.isArray(item.sub_menus) && item.sub_menus.length > 0;

        if (!hasChildren) {
          return (
            <Link
              key={item.id}
              href={getHref(item)}
              className='
                block
                px-4
                py-4
                text-sm
                text-white
                transition-colors
                no-underline!
                hover:text-primary-1
              '
            >
              {item.title}
            </Link>
          );
        }

        return (
          <AccordionItem
            key={item.id}
            value={String(item.id)}
            className='border-none'
          >
            <div className='flex items-center justify-between'>
              <Link
                href={getHref(item)}
                className='
                  flex-1
                  px-4
                  py-4
                  text-sm
                  text-white
                  no-underline!
                  transition-colors
                  hover:text-primary-1
                '
              >
                {item.title}
              </Link>

              <AccordionTrigger
                className='
                  w-10
                  shrink-0
                  justify-center
                  p-0
                  text-white
                  hover:text-primary-1
                  hover:no-underline
                '
              />
            </div>

            <AccordionContent className='pr-6 pb-2 text-white'>
              <CategoryAccordion items={item.sub_menus} />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}