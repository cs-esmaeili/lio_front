'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, Search } from 'lucide-react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { useProductList } from '@/hooks/product/useProductList';
import { cn } from '@/lib/utils';
import { resolveFileUrl } from '@/utils/fileUrl';
import { formatPrice } from './product-manager.model';
import type { AdminProductListItem } from '@/typescript/schemas/products/admin-product.schema';

export interface ProductPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  /** Allow selecting more than one product. */
  multiple?: boolean;
  /** Products selected when the dialog opens. */
  initialSelected?: AdminProductListItem[];
  /** Chosen products when the user confirms. */
  onSelect?: (products: AdminProductListItem[]) => void;
  /** Close the dialog after `onSelect`. Default `true`. */
  closeOnSelect?: boolean;
  size?: 'md' | 'lg' | 'xl';
}

const PAGE_SIZE = 10;

/** Searchable, paginated product picker dialog. */
export default function ProductPickerDialog({
  open,
  onOpenChange,
  title,
  multiple = false,
  initialSelected,
  onSelect,
  closeOnSelect = true,
  size = 'lg',
}: ProductPickerDialogProps) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Map<number, AdminProductListItem>>(
    () => new Map((initialSelected ?? []).map((product) => [product.id, product])),
  );

  const { data, loading, error } = useProductList({ page, limit: PAGE_SIZE, search });

  // Debounce the search box so typing does not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const selectedCount = selected.size;

  const toggle = (product: AdminProductListItem) => {
    setSelected((prev) => {
      if (!multiple) return new Map([[product.id, product]]);
      const next = new Map(prev);
      if (next.has(product.id)) next.delete(product.id);
      else next.set(product.id, product);
      return next;
    });
  };

  const handleConfirm = () => {
    if (selectedCount === 0) return;
    onSelect?.([...selected.values()]);
    if (closeOnSelect) onOpenChange(false);
  };

  const canPrev = page > 1;
  const canNext = page < (data.totalPages ?? 1);

  const footer = (
    <div className='flex flex-row items-center justify-between gap-3'>
      <span className='text-caption text-secondary-2'>
        {selectedCount > 0 ? `${selectedCount.toLocaleString('fa-IR')} محصول انتخاب شده` : 'محصولی انتخاب نشده است'}
      </span>

      <div className='flex flex-row items-center gap-3'>
        <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' onClick={() => onOpenChange(false)}>
          انصراف
        </Button>
        <Button type='button' className='h-11 rounded-xl px-6' disabled={selectedCount === 0} onClick={handleConfirm}>
          {multiple ? 'افزودن انتخاب‌شده‌ها' : 'انتخاب'}
        </Button>
      </div>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title={title ?? 'انتخاب محصول'} footer={footer} size={size}>
      <div className='flex flex-col gap-4'>
        <div className='relative'>
          <Search className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
          <Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder='جستجوی محصول...' className='h-11 ps-8' />
        </div>

        {loading && data.items.length === 0 ? (
          <div className='grid place-content-center py-16'>
            <Spinner className='size-8 text-primary-1' />
          </div>
        ) : error && data.items.length === 0 ? (
          <p className='py-16 text-center text-regular text-secondary-1'>{error}</p>
        ) : data.items.length === 0 ? (
          <p className='py-16 text-center text-caption text-secondary-3'>محصولی پیدا نشد.</p>
        ) : (
          <ul className='flex flex-col gap-2'>
            {data.items.map((product) => {
              const isSelected = selected.has(product.id);
              const image = resolveFileUrl(product.primaryImageUrl);

              return (
                <li key={product.id}>
                  <div
                    role='button'
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => toggle(product)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggle(product);
                      }
                    }}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition-colors',
                      isSelected ? 'border-primary-1 bg-primary-4/40' : 'border-gray-1 hover:border-primary-3',
                    )}>
                    <span
                      className={cn(
                        'grid size-5 shrink-0 place-content-center rounded-full border',
                        isSelected ? 'border-primary-1 bg-primary-1 text-custom-white' : 'border-gray-2 text-transparent',
                      )}>
                      <svg viewBox='0 0 10 10' className='size-3' aria-hidden='true'>
                        <path d='M1 5l2.5 2.5L9 2.5' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                    </span>

                    <div className='grid size-12 shrink-0 place-content-center overflow-hidden rounded-lg border border-gray-2 bg-gray-1'>
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt={product.name} className='h-full w-full object-cover' />
                      ) : (
                        <ImageOff className='text-secondary-3' size={16} aria-hidden='true' />
                      )}
                    </div>

                    <div className='flex min-w-0 flex-1 flex-col'>
                      <span className='truncate text-sm font-medium text-secondary-black-3'>{product.name}</span>
                      <span className='truncate text-caption text-secondary-3' dir='ltr'>
                        {product.slug}
                      </span>
                    </div>

                    <span className='shrink-0 text-caption text-secondary-2'>{formatPrice(product.priceFrom)} تومان</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {(canPrev || canNext) && (
          <div className='flex items-center justify-between border-t border-gray-1 pt-3'>
            <Button type='button' variant='outline' size='sm' className='h-9 rounded-lg border-gray-2' disabled={!canPrev || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronRight />
              قبلی
            </Button>
            <span className='text-caption text-secondary-2'>
              صفحه {(data.page ?? page).toLocaleString('fa-IR')} از {(data.totalPages ?? 1).toLocaleString('fa-IR')}
            </span>
            <Button type='button' variant='outline' size='sm' className='h-9 rounded-lg border-gray-2' disabled={!canNext || loading} onClick={() => setPage((p) => p + 1)}>
              بعدی
              <ChevronLeft />
            </Button>
          </div>
        )}
      </div>
    </ReusableModal>
  );
}
