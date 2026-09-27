'use client';

import { useRouter } from 'next/navigation';

import ProductForm from '@/components/admin/product-manager/ProductForm';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function NewProductPage() {
  const router = useRouter();
  const goBack = () => router.push('/admin/products');

  return (
    <PermissionGate anyOf={[PERMISSIONS.PRODUCT_READ, PERMISSIONS.PRODUCT_MANAGE]}>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2 rounded-2xl border border-gray-1 bg-custom-white p-6 md:p-8'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>محصول جدید</h1>
          <p className='text-regular text-secondary-2'>اطلاعات پایه، تصاویر، مشخصات و تنوع‌های محصول را تکمیل کنید.</p>
        </div>

        <ProductForm mode='create' product={null} onSaved={goBack} onCancel={goBack} />
      </div>
    </PermissionGate>
  );
}
