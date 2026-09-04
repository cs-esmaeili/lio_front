import Link from 'next/link';
import Icon from "@/components/global/Icon";
import { ArrowLeft } from "iconsax-reactjs";
import type { SearchItem } from '@/hooks/useSearch';

type Props = {
  items: SearchItem[];
  query: string;
  loading?: boolean;
  onItemClick?: () => void;
};

const SECTION_LABELS: Record<SearchItem['type'], string> = {
  product: 'محصولات',
  category: 'دسته‌بندی‌ها',
  brand: 'برندها',
  blog: 'مقالات',
};

const SECTION_ORDER: SearchItem['type'][] = ['product', 'category' /* [HIDDEN] brands and blog disabled */];

const SECTION_URLS: Partial<Record<SearchItem['type'], string>> = {
  product: '/shop/',
  category: '/product-category/',
};

function groupByType(items: SearchItem[]) {
  const groups = new Map<SearchItem['type'], SearchItem[]>();
  for (const item of items) {
    const list = groups.get(item.type);
    if (list) {
      list.push(item);
    } else {
      groups.set(item.type, [item]);
    }
  }
  return groups;
}

function getItemUrl(item: SearchItem): string {
  switch (item.type) {
    case 'product':
      return `/product/${item.slug}`;
    case 'category':
      return `/product-category/${item.slug}`;
    case 'brand':
      return `/brands/${item.slug}`;
    case 'blog':
      return `/blog/${item.slug}`;
    default:
      return '#';
  }
}

function getSectionUrl(type: SearchItem['type'], query: string): string {
  const baseUrl = SECTION_URLS[type];

  if (!baseUrl) return '/';

  const param = type === 'category' ? 'search' : 'title';

  return `${baseUrl}?${param}=${encodeURIComponent(query.trim())}`;
}

function ResultItem({ item, onItemClick }: { item: SearchItem; onItemClick?: () => void }) {
  return (
    <Link
      href={getItemUrl(item)}
      onClick={onItemClick}
      className='flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
        bg-white/5 backdrop-blur-md hover:bg-white/10 text-custom-white'>
      {item.image && <img src={item.image} alt={item.title} className='w-12 h-12 rounded-lg object-cover shrink-0' />}
      <div className='min-w-0'>
        <div className='font-medium truncate'>{item.title}</div>
        <div className='text-sm mt-1 text-secondary-2'>{item.subtitle}</div>
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

  const groups = groupByType(items);

  return (
    <div className='p-2 space-y-3 bg-secondary-black-3 rounded-2xl mt-1 max-h-[calc(100vh-20rem)] overflow-y-auto overflow-x-hidden'>
      {SECTION_ORDER.map((type) => {
        const groupItems = groups.get(type);
        if (!groupItems || groupItems.length === 0) return null;

        return (
          <div key={type}>
            <div className='px-3 py-1.5 text-base font-semibold text-secondary-3'>{SECTION_LABELS[type]}</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1'>
              {groupItems.map((item) => (
                <ResultItem key={item.id} item={item} onItemClick={onItemClick} />
              ))}
            </div>
            <Link
              href={getSectionUrl(type, query)}
              onClick={onItemClick}
              className='my-3 flex w-32 items-center justify-center mr-auto'>
               <button className="flex group-hover:gap-2 gap-1 justify-end items-center text-sm text-primary-1 transition-all duration-300">
                  <span>مشاهده نتایج</span>
                  <Icon 
                    IconComponent={ArrowLeft} 
                    size={20} 
                    variant="TwoTone" 
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
            </Link>

          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;
