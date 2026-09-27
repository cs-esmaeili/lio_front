'use client';

import { useParams, useRouter } from 'next/navigation';
import { CircleAlert, Package } from 'lucide-react';

import ProductForm from '@/components/admin/product-manager/ProductForm';
import PermissionGate from '@/components/global/PermissionGate';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { useProduct } from '@/hooks/product/useProduct';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const parsedId = Number(params?.id);
  const id = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;

  const { product, loading, error, refetch } = useProduct(id);
  const goBack = () => router.push('/admin/products');

  return (
    <PermissionGate anyOf={[PERMISSIONS.PRODUCT_READ, PERMISSIONS.PRODUCT_MANAGE]}>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2 rounded-2xl border border-gray-1 bg-custom-white p-6 md:p-8'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>{product ? `ویرایش «${product.name}»` : 'ویرایش محصول'}</h1>
          <p className='text-regular text-secondary-2'>تغییرات با زدن دکمه ذخیره اعمال می‌شوند.</p>
        </div>

        {loading && !product ? (
          <div className='grid min-h-[40vh] place-content-center'>
            <Spinner className='size-8 text-primary-1' />
          </div>
        ) : error && !product ? (
          <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
            <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
            <p className='text-regular text-secondary-1'>{error}</p>
            <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
              تلاش دوباره
            </Button>
          </div>
        ) : !product ? (
          <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
            <Package className='text-secondary-3' size={36} aria-hidden='true' />
            <p className='text-regular text-secondary-2'>محصول مورد نظر پیدا نشد.</p>
            <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={goBack}>
              بازگشت به فهرست
            </Button>
          </div>
        ) : (
          <ProductForm key={product.id} mode='edit' product={product} onSaved={goBack} onCancel={goBack} />
        )}
      </div>
    </PermissionGate>
  );
}
