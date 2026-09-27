'use client';

import { useState } from 'react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Spinner } from '@/components/shadcn/spinner';
import { Switch } from '@/components/shadcn/switch';
import { useAttributeMutations } from '@/hooks/attribute/useAttributeMutations';
import {
  ATTRIBUTE_NAME_PATTERN,
  ATTRIBUTE_USAGE_LABELS,
  FILTER_TYPE_LABELS,
  type AdminAttribute,
  type AttributeUsage,
  type FilterType,
} from '@/typescript/schemas/attribute.schema';

interface AttributeEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initial: AdminAttribute | null;
  onSaved: (attribute: AdminAttribute) => void;
}

const FILTER_TYPES: FilterType[] = ['CHECKBOX', 'RADIO', 'SELECT', 'RANGE', 'TOGGLE', 'SEARCH'];
const USAGES: AttributeUsage[] = ['SPEC', 'VARIANT'];

export default function AttributeEditorModal({ open, onOpenChange, mode, initial, onSaved }: AttributeEditorModalProps) {
  const { createAttribute, updateAttribute, creating, updating } = useAttributeMutations();

  const [name, setName] = useState(initial?.name ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [usage, setUsage] = useState<AttributeUsage>(initial?.usage ?? 'SPEC');
  const [filterType, setFilterType] = useState<FilterType>(initial?.filterType ?? 'CHECKBOX');
  const [isMultiSelect, setIsMultiSelect] = useState(initial?.isMultiSelect ?? true);
  const [error, setError] = useState<string | null>(null);

  const loading = mode === 'create' ? creating : updating;

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedTitle = title.trim();

    if (!trimmedName) {
      setError('نام فنی ویژگی را وارد کنید.');
      return;
    }
    if (!ATTRIBUTE_NAME_PATTERN.test(trimmedName)) {
      setError('نام فنی فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و «-» باشد.');
      return;
    }
    if (!trimmedTitle) {
      setError('عنوان ویژگی را وارد کنید.');
      return;
    }

    const payload = { name: trimmedName, title: trimmedTitle, usage, filterType, isMultiSelect };
    const saved = mode === 'create' ? await createAttribute(payload) : initial ? await updateAttribute(initial.id, payload) : null;

    if (!saved) return;
    onSaved(saved);
    onOpenChange(false);
  };

  const footer = (
    <div className='flex flex-row items-center justify-end gap-3'>
      <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' disabled={loading} onClick={() => onOpenChange(false)}>
        انصراف
      </Button>
      <Button type='button' className='h-11 rounded-xl px-6' disabled={loading} onClick={() => void handleSubmit()}>
        {loading && <Spinner />}
        {mode === 'create' ? 'ایجاد ویژگی' : 'ذخیره تغییرات'}
      </Button>
    </div>
  );

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === 'create' ? 'ویژگی جدید' : `ویرایش «${initial?.title ?? ''}»`}
      footer={footer}
      size='lg'>
      <div className='flex flex-col gap-5'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='attribute-name' className='text-sm text-secondary-1'>
              نام فنی
            </Label>
            <Input
              id='attribute-name'
              dir='ltr'
              value={name}
              placeholder='color'
              className='h-11 font-medium'
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError(null);
              }}
            />
            <p className='text-caption text-secondary-3'>حروف انگلیسی کوچک، عدد و «-». برای فیلترها استفاده می‌شود.</p>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='attribute-title' className='text-sm text-secondary-1'>
              عنوان
            </Label>
            <Input
              id='attribute-title'
              value={title}
              placeholder='رنگ'
              className='h-11'
              onChange={(event) => {
                setTitle(event.target.value);
                if (error) setError(null);
              }}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Label className='text-sm text-secondary-1'>کاربرد</Label>
            <Select value={usage} onValueChange={(value) => setUsage(value as AttributeUsage)}>
              <SelectTrigger className='h-11 w-full rounded-lg border-gray-2'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USAGES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {ATTRIBUTE_USAGE_LABELS[item]}
                    {item === 'VARIANT' ? ' (محور قیمت و موجودی)' : ' (مشخصه محصول)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label className='text-sm text-secondary-1'>نوع فیلتر</Label>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
              <SelectTrigger className='h-11 w-full rounded-lg border-gray-2'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FILTER_TYPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {FILTER_TYPE_LABELS[item]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex items-center justify-between rounded-xl border border-gray-1 px-4 py-3'>
          <div className='flex flex-col'>
            <span className='text-sm text-secondary-1'>انتخاب چندگانه</span>
            <span className='text-caption text-secondary-3'>کاربر می‌تواند چند مقدار از این ویژگی انتخاب کند.</span>
          </div>
          <Switch checked={isMultiSelect} onCheckedChange={setIsMultiSelect} />
        </div>

        {error && <p className='text-sm text-custom-red'>{error}</p>}
      </div>
    </ReusableModal>
  );
}
