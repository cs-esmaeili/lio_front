'use client';

import ProductListSectionsManager from '@/components/admin/sections/product-list/ProductListSectionsManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminProductListPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.PAGE_MANAGE]}>
      <ProductListSectionsManager />
    </PermissionGate>
  );
}
