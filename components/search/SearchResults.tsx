import Link from 'next/link';
import Icon from '@/components/global/Icon';
import { ArrowLeft } from 'iconsax-reactjs';
import { resolveFileUrl } from '@/utils/fileUrl';
import { buildProductsSearchUrl } from '@/utils/shop/urlHelpers';
import type { ProductSearchItem } from '@/typescript/schemas/products/product-search.schema';

type Props = {
  items: ProductSearchItem[];
  query: string;
  loading?: boolean;
  onItemClick?: () => void;
};

function ResultItem({ item, onItemClick }: { item: ProductSearchItem; onItemClick?: () => void }) {
  const image = resolveFileUrl(item.image);

  return (
    <Link
      href={`/product/${item.slug}`}
      onClick={onItemClick}
      className='flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
        bg-white/5 backdrop-blur-md hover:bg-white/10 text-custom-white'>
      {image && <img src={image} alt={item.title} className='w-12 h-12 rounded-lg object-cover shrink-0' />}
      <div className='min-w-0'>
        <div className='font-medium truncate'>{item.title}</div>
        <div className='text-sm mt-1 text-secondary-2'>محصول</div>
      </div>
    </Link>
  );
}

const SearchResults = ({ items, query, loading, onItemClick }: Props) => {
  if (!query.trim()) return null;

  if (loading) {
    return <div className='py-4 text-center text-sm text-secondary-2'>در حال جستجو...</div>;
  }

  if (items.length === 0) {
    return <div className='py-4 text-center text-sm text-secondary-2'>نتیجه‌ای یافت نشد</div>;
  }

  return (
    <div className='p-2 space-y-3 bg-secondary-black-3 rounded-2xl mt-1 max-h-[calc(100vh-20rem)] overflow-y-auto overflow-x-hidden'>
      <div>
        <div className='px-3 py-1.5 text-base font-semibold text-secondary-3'>محصولات</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1'>
          {items.map((item) => (
            <ResultItem key={item.id} item={item} onItemClick={onItemClick} />
          ))}
        </div>
        <Link
          href={buildProductsSearchUrl(query)}
          onClick={onItemClick}
          className='my-3 flex w-32 items-center justify-center mr-auto cursor-pointer'>
          <button className='flex group-hover:gap-2 gap-1 justify-end items-center text-sm text-primary-1 transition-all duration-300 cursor-pointer'>
            <span>مشاهده نتایج</span>
            <Icon
              IconComponent={ArrowLeft}
              size={20}
              variant='TwoTone'
              className='group-hover:translate-x-1 transition-transform duration-300'
            />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SearchResults;
