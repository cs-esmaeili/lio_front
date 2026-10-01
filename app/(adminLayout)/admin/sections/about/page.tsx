'use client';

import AboutManager from '@/components/admin/sections/about/AboutManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminAboutPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.PAGE_MANAGE]}>
      <AboutManager />
    </PermissionGate>
  );
}
