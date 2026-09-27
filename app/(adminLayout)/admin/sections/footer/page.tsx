'use client';

import FooterManager from '@/components/admin/sections/footer/FooterManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminFooterPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.PAGE_MANAGE]}>
      <FooterManager />
    </PermissionGate>
  );
}
