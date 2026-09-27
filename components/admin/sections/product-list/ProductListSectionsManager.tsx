'use client';

import { useState } from 'react';
import { CircleAlert, Package, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import ProductPickerDialog from '@/components/admin/product-manager/ProductPickerDialog';
import ConfirmDeleteSectionItemModal from '@/components/admin/sections/ConfirmDeleteSectionItemModal';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { useCreateProductListItem } from '@/hooks/page-sections/useCreateProductListItem';
import { useDeleteProductListItem } from '@/hooks/page-sections/useDeleteProductListItem';
import { useProductListSections } from '@/hooks/page-sections/useProductListSections';
import { useUpdateProductListItem } from '@/hooks/page-sections/useUpdateProductListItem';
import ProductCard from './ProductCard';
import type { AdminProductListItem } from '@/typescript/schemas/products/admin-product.schema';
import type { ProductListItem } from '@/typescript/schemas/page-section.schema';

type PickerState = { sectionId: number; mode: 'create' | 'edit'; itemId?: number; initialSelected?: AdminProductListItem[] };
type DeleteState = { sectionId: number; item: ProductListItem };

/** Turn a section product row into the shape the picker expects. */
function toPickerProduct(item: ProductListItem): AdminProductListItem {
  const primary = item.images.find((image) => image.isPrimary) ?? item.images[0];
  return {
    id: item.productId,
    name: item.productName,
    slug: item.productSlug,
    primaryImageUrl: primary?.url ?? null,
    categories: [],
    variantCount: 0,
    priceFrom: item.defaultVariant?.price ?? null,
    priceTo: null,
    totalStock: item.defaultVariant?.stock ?? 0,
  };
}

/** Manage every PRODUCT_LIST section on the home page and its products. */
export default function ProductListSectionsManager() {
  const { sections, loading, error, refetch } = useProductListSections();
  const { createProductItem } = useCreateProductListItem();
  const { updateProductItem } = useUpdateProductListItem();
  const { deleteProductItem, loading: deleting } = useDeleteProductListItem();

  const [picker, setPicker] = useState<PickerState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteState | null>(null);

  const handlePick = async (products: AdminProductListItem[]) => {
    const product = products[0];
    if (!product || !picker) return;

    const saved =
      picker.mode === 'edit' && picker.itemId
        ? await updateProductItem(picker.sectionId, { id: picker.itemId, productId: product.id })
        : await createProductItem(picker.sectionId, { productId: product.id });
    if (!saved) return;

    toast.success(picker.mode === 'edit' ? 'محصول ذخیره شد.' : 'محصول افزوده شد.');
    setPicker(null);
    void refetch();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const updated = await deleteProductItem(deleteTarget.sectionId, deleteTarget.item.id);
    if (!updated) return;

    toast.success('محصول حذف شد.');
    setDeleteTarget(null);
    void refetch();
  };

  // --------------------------------------------------------

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>لیست محصولات</h1>
          <p className='text-regular text-secondary-2'>محصولات بخش‌های مختلف صفحه اصلی را مدیریت کنید.</p>
        </div>

        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          className='h-11 w-11 shrink-0 rounded-xl border-gray-2 text-secondary-2'
          title='بروزرسانی'
          disabled={loading}
          onClick={() => void refetch()}>
          {loading ? <Spinner /> : <RefreshCw />}
        </Button>
      </div>

      {/* List */}
      {loading && sections.length === 0 ? (
        <div className='flex flex-col gap-4'>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className='h-64 animate-pulse rounded-2xl border border-gray-1 bg-gray-1/60' />
          ))}
        </div>
      ) : error && sections.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
          <p className='text-regular text-secondary-1'>{error}</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
            تلاش دوباره
          </Button>
        </div>
      ) : sections.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <Package className='text-secondary-3' size={36} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>بخش لیست محصولی روی صفحه اصلی پیدا نشد.</p>
        </div>
      ) : (
        sections.map((section) => (
          <div key={section.id} className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-5 md:p-6'>
            <div className='flex items-center justify-between gap-3 border-b border-gray-1 pb-4'>
              <div className='flex items-center gap-2'>
                <h2 className='text-base font-bold text-secondary-black-3'>{section.title || section.location}</h2>
                <span className='rounded-full bg-primary-4 px-2 py-0.5 text-caption text-primary-1'>
                  {section.data.products.length.toLocaleString('fa-IR')}
                </span>
              </div>

              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-9 rounded-lg border-gray-2'
                onClick={() => setPicker({ sectionId: section.id, mode: 'create' })}>
                <Plus />
                افزودن محصول
              </Button>
            </div>

            {section.data.products.length === 0 ? (
              <p className='py-6 text-center text-caption text-secondary-3'>محصولی در این بخش ثبت نشده است.</p>
            ) : (
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4'>
                {section.data.products.map((item, index) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    index={index}
                    deleting={deleting && deleteTarget?.item.id === item.id}
                    onEdit={(value) => setPicker({ sectionId: section.id, mode: 'edit', itemId: value.id, initialSelected: [toPickerProduct(value)] })}
                    onDelete={(value) => setDeleteTarget({ sectionId: section.id, item: value })}
                  />
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {/* Picker dialog */}
      {picker !== null && (
        <ProductPickerDialog
          open
          onOpenChange={(open) => {
            if (!open) setPicker(null);
          }}
          title={picker.mode === 'edit' ? 'تغییر محصول' : 'افزودن محصول'}
          initialSelected={picker.initialSelected}
          onSelect={(products) => void handlePick(products)}
        />
      )}

      <ConfirmDeleteSectionItemModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        name={deleteTarget?.item.productName || 'محصول'}
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
