'use client';

import { useState } from 'react';

import CategoryTabs from '@/components/Header/categoriesMobile/CategoryTabs';
import CategoryContent from '@/components/Header/categoriesMobile/CategoryContent';

import type { CategoryItem } from '@/components/Header/categoriesMobile/types';

interface CategoryMobileProps {
  categories: CategoryItem[];
}

export default function CategoryMobile({ categories }: CategoryMobileProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(categories[0]?.id ?? 0);

  const activeCategory = categories.find((category) => category.id === activeCategoryId) ?? categories[0];

  if (!activeCategory) {
    return <div className='flex h-full items-center justify-center py-10'>دسته‌بندی‌ای یافت نشد.</div>;
  }

  return (
    <div className='flex h-full overflow-hidden rounded-xl bg-background'>
      {/* ستون دسته‌ها */}
      <aside className='w-28 shrink-0 border-l bg-muted/20'>
        <CategoryTabs categories={categories} activeCategoryId={activeCategoryId} onChange={setActiveCategoryId} />
      </aside>

      {/* محتوای دسته */}
      <main className='flex-1 overflow-hidden'>
        <CategoryContent category={activeCategory} />
      </main>
    </div>
  );
}
