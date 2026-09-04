import CategoryAccordion from '@/components/Header/categoriesMobile/CategoryAccordion';
import type { CategoryItem } from '@/components/Header/categoriesMobile/types';
import Link from 'next/link';

interface CategoryContentProps {
  category: CategoryItem;
}

export default function CategoryContent({ category }: CategoryContentProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 overflow-y-auto'>
        <Link className='px-4 text-primary-1' href={category.slug}>همه محصولات {category.title}</Link>

        <CategoryAccordion categories={category.children} />
      </div>
    </div>
  );
}
