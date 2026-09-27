# File Manager

مدیریت فایل مبتنی بر `GET/POST/DELETE /files` بک‌اند. همه‌ی روت‌ها در
`services/fileManager.service.ts` و هر روت یک هوک CSR جدا در `hooks/file-manager/` دارد.

## استفاده به‌صورت دیالوگ (انتخاب فایل)

```tsx
'use client';

import { useState } from 'react';
import FileManagerDialog from '@/components/admin/file-manager/FileManagerDialog';
import type { SelectedFile } from '@/components/admin/file-manager/file-manager.model';

export function CoverPicker() {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<SelectedFile | null>(null);

  return (
    <>
      <button type='button' onClick={() => setOpen(true)}>
        {cover ? 'تغییر تصویر' : 'انتخاب تصویر'}
      </button>

      <FileManagerDialog
        open={open}
        onOpenChange={setOpen}
        title='انتخاب کاور'
        accept='image/*'
        onSelect={(files) => setCover(files[0])}
      />
    </>
  );
}
```

- `multiple` برای انتخاب چندتایی.
- `accept` فیلتر انتخاب است (مثل `image/*,.pdf`)؛ فایل‌های غیرمطابق نمایش داده می‌شوند ولی قابل انتخاب نیستند.
- `canManage={false}` حالت انتخاب خالص (بدون آپلود/حذف/پوشه جدید).
- `onSelectionChange` برای اطلاع زنده از انتخاب.
- `initialPath` برای باز شدن روی یک پوشه مشخص.

## استفاده به‌صورت جاسازی‌شده (بدون دیالوگ)

```tsx
<FileManagerBrowser
  canManage
  selectable
  multiple
  className='h-[70vh]'
  onSelectionChange={setSelection}
  onUploaded={(files) => console.log(files)}
/>
```

## خروجی انتخاب

```ts
interface SelectedFile {
  id?: number;
  name: string;
  path: string;
  url: string; // resolveFileUrl شده و آماده‌ی استفاده در <img src>
  mimeType?: string;
  size?: number;
  createdAt?: string;
}
```
