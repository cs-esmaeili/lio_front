import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion';

import type { CategoryItem } from '@/components/Header/categoriesMobile/types';

interface CategoryAccordionProps {
  categories: CategoryItem[];
}

export default function CategoryAccordion({ categories }: CategoryAccordionProps) {
  return (
    <Accordion type='single' collapsible className='w-full'>
      {categories.map((category) => {
        const hasChildren = category.children.length > 0;

        return (
          <AccordionItem key={category.id} value={`category-${category.id}`}>
            <div className='flex items-center justify-between px-4'>
              <Link href={`/product-category/${category.slug}`} className='flex-1 py-4 text-sm font-medium'>
                {category.title}
              </Link>

              {hasChildren && <AccordionTrigger className='w-10 justify-center p-0 hover:no-underline' />}
            </div>

            {hasChildren && (
              <AccordionContent>
                <div className='flex flex-col'>
                  {category.children.map((child :any) => (
                    <Link
                      key={child.id}
                      href={`/product-category/${child.slug}`}
                      className='flex items-center justify-between px-8 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground no-underline!'>
                      <span>{child.title}</span>
                      <ChevronLeft className='h-4 w-4' />
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
