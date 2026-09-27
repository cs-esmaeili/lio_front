'use client';

import { useState } from 'react';
import { FolderTree, X } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import type { AdminCategory } from '@/typescript/schemas/category.schema';
import CategoryPickerDialog from './CategoryPickerDialog';
import { getCategoryPathLabel } from './category-manager.model';

interface CategoryPickerFieldProps {
  label: string;
  value: AdminCategory | null;
  onChange: (category: AdminCategory | null) => void;
  /** Full flat list, used to render the selected category path. */
  categories: AdminCategory[];
  /** Ids that cannot be picked (e.g. the edited category and its descendants). */
  disabledIds?: number[];
  /** Offer a "root / no parent" choice. */
  allowRootOption?: boolean;
  placeholder?: string;
  pickerTitle?: string;
  disabled?: boolean;
}

/** Form field that picks a single category through the shared picker dialog. */
export default function CategoryPickerField({
  label,
  value,
  onChange,
  categories,
  disabledIds,
  allowRootOption = false,
  placeholder = 'دسته‌بندی‌ای انتخاب نشده',
  pickerTitle,
  disabled = false,
}: CategoryPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const display = value ? getCategoryPathLabel(categories, value.id) || value.name : null;

  return (
    <div className='flex flex-col gap-2'>
      <span className='text-sm text-secondary-1'>{label}</span>

      <div className='flex items-center gap-2'>
        <div className='flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-2 px-3'>
          <FolderTree className='size-4 shrink-0 text-secondary-3' aria-hidden='true' />
          <span className={`truncate text-regular ${display ? 'text-secondary-black-3' : 'text-secondary-3'}`} title={display ?? undefined}>
            {display ?? placeholder}
          </span>
        </div>

        <Button
          type='button'
          variant='outline'
          className='h-11 shrink-0 rounded-lg border-gray-2'
          disabled={disabled}
          onClick={() => setOpen(true)}>
          {value ? 'تغییر' : 'انتخاب'}
        </Button>

        {value && allowRootOption && !disabled && (
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            className='shrink-0 text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
            title='حذف والد'
            onClick={() => onChange(null)}>
            <X />
          </Button>
        )}
      </div>

      <CategoryPickerDialog
        open={open}
        onOpenChange={setOpen}
        title={pickerTitle ?? `انتخاب ${label}`}
        selectedIds={value ? [value.id] : []}
        disabledIds={disabledIds}
        allowRootOption={allowRootOption}
        onSelect={(picked) => {
          const next = picked[0] ?? null;
          if (next?.id !== value?.id) onChange(next);
        }}
      />
    </div>
  );
}
