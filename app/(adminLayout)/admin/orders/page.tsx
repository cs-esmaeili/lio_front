'use client';

import OrdersManager from '@/components/admin/order-manager/OrdersManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminOrdersPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.ORDER_READ]}>
      <OrdersManager />
    </PermissionGate>
  );
}
