'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CircleAlert, ImageOff, Package, Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';

import ConfirmDeleteProductModal from '@/components/admin/product-manager/ConfirmDeleteProductModal';
import { getCategoryPathLabel } from '@/components/admin/category-manager/category-manager.model';
import { DataTable, DataTablePagination, createAppColumnHelper } from '@/components/global/DataTable';
import PermissionGate from '@/components/global/PermissionGate';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Spinner } from '@/components/shadcn/spinner';
import { useCategoryList } from '@/hooks/category/useCategoryList';
import { usePermissions } from '@/hooks/auth/usePermissions';
import { useProductList } from '@/hooks/product/useProductList';
import { useProductMutations } from '@/hooks/product/useProductMutations';
import { PERMISSIONS } from '@/typescript/constants/permissions';
import { formatPrice } from '@/components/admin/product-manager/product-manager.model';
import type { AdminProductListItem } from '@/typescript/schemas/products/admin-product.schema';

const columnHelper = createAppColumnHelper<AdminProductListItem>();
const PAGE_SIZE = 20;

export default function AdminProductsPage() {
  const { categories } = useCategoryList();
  const { hasPermission } = usePermissions();
  const canManage = hasPermission(PERMISSIONS.PRODUCT_MANAGE);

  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminProductListItem | null>(null);

  const { deleteProduct, deleting } = useProductMutations();
  const { data, loading, error, refetch } = useProductList({ page, limit: PAGE_SIZE, search, categoryId });

  // Debounce the search box so typing does not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const removed = await deleteProduct(deleteTarget.id);
    if (!removed) return;
    setDeleteTarget(null);
    if (data.items.length === 1 && page > 1) setPage((current) => current - 1);
    else void refetch();
  };

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('name', {
          header: 'محصول',
          cell: (info) => {
            const product = info.row.original;
            return (
              <div className='flex items-center gap-3'>
                <span className='grid size-11 shrink-0 place-content-center overflow-hidden rounded-lg border border-gray-1 bg-gray-1'>
                  {product.primaryImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.primaryImageUrl} alt={product.name} className='h-full w-full object-cover' />
                  ) : (
                    <ImageOff className='text-secondary-3' size={18} aria-hidden='true' />
                  )}
                </span>
                <div className='flex min-w-0 flex-col'>
                  <span className='truncate font-medium text-secondary-black-3' title={product.name}>
                    {product.name}
                  </span>
                  <span className='truncate text-caption text-secondary-3' dir='ltr' title={product.slug}>
                    {product.slug}
                  </span>
                </div>
              </div>
            );
          },
        }),
        columnHelper.accessor((row) => row.categories.length, {
          id: 'categories',
          header: 'دسته‌بندی',
          cell: (info) => {
            const list = info.row.original.categories;
            if (list.length === 0) return <span className='text-secondary-3'>—</span>;
            return (
              <div className='flex flex-wrap gap-1'>
                {list.slice(0, 2).map((category) => (
                  <span key={category.id} className='rounded-full bg-gray-1 px-2 py-0.5 text-caption text-secondary-1'>
                    {category.name}
                  </span>
                ))}
                {list.length > 2 && <span className='text-caption text-secondary-3'>+{(list.length - 2).toLocaleString('fa-IR')}</span>}
              </div>
            );
          },
        }),
        columnHelper.accessor('variantCount', {
          header: 'تنوع‌ها',
          cell: (info) => <span className='text-secondary-1'>{info.getValue().toLocaleString('fa-IR')}</span>,
        }),
        columnHelper.accessor('priceFrom', {
          header: 'قیمت',
          cell: (info) => {
            const product = info.row.original;
            if (product.priceFrom === null) return <span className='text-secondary-3'>—</span>;
            if (product.priceFrom === product.priceTo) return <span>{formatPrice(product.priceFrom)}</span>;
            return (
              <span>
                {formatPrice(product.priceFrom)} تا {formatPrice(product.priceTo)}
              </span>
            );
          },
        }),
        columnHelper.accessor('totalStock', {
          header: 'موجودی',
          cell: (info) => <span className='text-secondary-1'>{info.getValue().toLocaleString('fa-IR')}</span>,
        }),
        columnHelper.display({
          id: 'actions',
          header: 'عملیات',
          enableSorting: false,
          cell: (info) => {
            const product = info.row.original;
            return (
              <div className='flex items-center gap-1'>
                <Button variant='ghost' size='icon-sm' className='rounded-lg text-secondary-2' title='ویرایش' asChild>
                  <Link href={`/admin/products/${product.id}`}>
                    <Pencil />
                  </Link>
                </Button>
                {canManage && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    className='rounded-lg text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
                    title='حذف'
                    onClick={() => setDeleteTarget(product)}>
                    <Trash2 />
                  </Button>
                )}
              </div>
            );
          },
        }),
      ]),
    [canManage],
  );

  return (
    <PermissionGate anyOf={[PERMISSIONS.PRODUCT_READ, PERMISSIONS.PRODUCT_MANAGE]}>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>محصولات</h1>
            <p className='text-regular text-secondary-2'>فهرست محصولات همراه با دسته‌بندی، تعداد تنوع‌ها، بازه قیمت و موجودی.</p>
          </div>

          {canManage && (
            <Button type='button' className='h-11 shrink-0 rounded-xl px-5' asChild>
              <Link href='/admin/products/new'>
                <Plus />
                محصول جدید
              </Link>
            </Button>
          )}
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <div className='relative min-w-0 flex-1 sm:max-w-80'>
            <Search className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
            <Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder='جستجو بر اساس نام محصول...' className='h-10 ps-8' />
          </div>

          <Select
            value={categoryId !== undefined ? String(categoryId) : 'all'}
            onValueChange={(value) => {
              setCategoryId(value === 'all' ? undefined : Number(value));
              setPage(1);
            }}>
            <SelectTrigger className='h-10 w-full rounded-lg border-gray-2 sm:w-64'>
              <SelectValue placeholder='همه دسته‌بندی‌ها' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>همه دسته‌بندی‌ها</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {getCategoryPathLabel(categories, category.id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type='button'
            variant='outline'
            size='icon-sm'
            className='h-10 w-10 shrink-0 rounded-lg border-gray-2 text-secondary-2'
            title='بروزرسانی'
            disabled={loading}
            onClick={() => void refetch()}>
            {loading ? <Spinner /> : <RefreshCw />}
          </Button>

          <span className='hidden text-caption text-secondary-2 sm:ms-auto sm:block'>{data.total.toLocaleString('fa-IR')} محصول</span>
        </div>

        {error && data.items.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
            <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
            <p className='text-regular text-secondary-1'>{error}</p>
            <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
              تلاش دوباره
            </Button>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={data.items}
              getRowId={(product) => String(product.id)}
              isLoading={loading && data.items.length === 0}
              enableSorting={false}
              emptyIcon={Package}
              emptyMessage={
                search.trim() || categoryId !== undefined ? 'محصولی با این فیلترها پیدا نشد.' : 'هنوز محصولی ثبت نشده است.'
              }
              emptyAction={
                canManage ? (
                  <Button type='button' variant='outline' size='sm' className='rounded-lg' asChild>
                    <Link href='/admin/products/new'>
                      <Plus />
                      ایجاد اولین محصول
                    </Link>
                  </Button>
                ) : null
              }
            />

            {data.totalPages > 1 && (
              <DataTablePagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} disabled={loading} />
            )}
          </>
        )}

        <ConfirmDeleteProductModal
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          product={deleteTarget}
          loading={deleting}
          onConfirm={() => void handleConfirmDelete()}
        />
      </div>
    </PermissionGate>
  );
}
