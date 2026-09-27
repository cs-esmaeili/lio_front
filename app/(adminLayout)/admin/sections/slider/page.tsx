'use client';

import SliderSlidesManager from '@/components/admin/sections/slider/SliderSlidesManager';
import PermissionGate from '@/components/global/PermissionGate';
import { PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminSliderPage() {
  return (
    <PermissionGate allOf={[PERMISSIONS.PAGE_MANAGE]}>
      <SliderSlidesManager />
    </PermissionGate>
  );
}
