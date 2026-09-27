'use client';

import HeaderManager from '@/components/admin/sections/header/HeaderManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminHeaderPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.PAGE_MANAGE]}>
      <HeaderManager />
    </PermissionGate>
  );
}
