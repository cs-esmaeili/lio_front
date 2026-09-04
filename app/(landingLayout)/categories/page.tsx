import CategoryMobile from '@/components/Header/categoriesMobile/CategoryMobile';
import { HeaderFooterInfo } from '@/services/HeaderFooter.service';
import type { CategoryItem } from '@/components/Header/categoriesMobile/types';

function toCategoryItem(item: any): CategoryItem {
  return {
    id: item.id,
    title: item.title,
    slug: item.link,
    image: item.image,
    children: (item.sub_menus ?? []).map((child: any) => toCategoryItem(child)),
  };
}

export default async function CategoriesPage() {
  const headerData = await HeaderFooterInfo('header');
  const menuList: CategoryItem[] = (headerData.data?.header ?? []).map((item: any) => toCategoryItem(item));

  
  return (
    <div className='h-[calc(100vh-130px)] md:h-[calc(100vh-150px)] bg-background pb-30 md:pb-10'>
      <CategoryMobile categories={menuList} />
    </div>
  );
}
