import { Suspense } from 'react';
import PageTitle from '@/components/global/PageTitle';
import Gradient from '@/components/global/Gradient';
import CategoryCard from '@/components/global/Cards/CategoryCard';
import { searchCategories } from '@/services/HeaderFooter.service';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim();

  const result = await searchCategories(search);

  const categoryList = [
    ...(result?.main_categories ?? []),
    ...(search ? result?.sub_categories ?? [] : []),
  ];

  return (
    <>
      <Gradient />

      <div className='container max-sm:p-0 my-6'>
        <PageTitle title='دسته‌بندی‌های ویزویز' />

        <Suspense fallback={null}>
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-6 gap-y-2 my-10'>
            {categoryList.map(
              (category: {
                id: number;
                image: string | null;
                title: string;
                slug: string;
                children: any[];
              }) => (
                <div key={category.id}>
                  <CategoryCard
                    id={category.id}
                    image={category.image ?? ''}
                    link={`/product-category/${category.slug}`}
                    title={category.title}
                  />
                </div>
              ),
            )}
          </div>
        </Suspense>
      </div>
    </>
  );
}