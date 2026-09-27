'use client';

import IntroductionManager from '@/components/admin/sections/introduction/IntroductionManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminIntroductionPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.PAGE_MANAGE]}>
      <IntroductionManager />
    </PermissionGate>
  );
}
