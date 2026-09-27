'use client';

import { useState } from 'react';
import { KeyRound, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Spinner } from '@/components/shadcn/spinner';
import { Switch } from '@/components/shadcn/switch';
import { Textarea } from '@/components/shadcn/textarea';
import { useUpsertSiteSetting } from '@/hooks/site-settings/useUpsertSiteSetting';

import {
  FIELD_TYPE_LABELS,
  createEmptyField,
  fieldsToData,
  settingDataToFields,
  type SettingField,
  type SettingFieldType,
} from './site-settings.model';
import type { SiteSetting } from '@/typescript/schemas/site-setting.schema';

interface SiteSettingEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  /** Existing setting when editing; `null` when creating. */
  initial: SiteSetting | null;
  onSaved: (setting: SiteSetting) => void;
}

const FIELD_TYPES: SettingFieldType[] = ['string', 'number', 'boolean', 'json'];

export default function SiteSettingEditorModal({ open, onOpenChange, mode, initial, onSaved }: SiteSettingEditorModalProps) {
  const { upsertSetting, loading } = useUpsertSiteSetting();

  const [keyValue, setKeyValue] = useState(initial?.key ?? '');
  const [isPrivate, setIsPrivate] = useState(initial?.isPrivate ?? false);
  const [fields, setFields] = useState<SettingField[]>(() =>
    initial ? settingDataToFields(initial.data) : [createEmptyField()],
  );
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------------

  const updateField = (id: string, patch: Partial<SettingField>) => {
    setFields((prev) => prev.map((field) => (field.id === id ? { ...field, ...patch } : field)));
    if (error) setError(null);
  };

  const changeFieldType = (id: string, type: SettingFieldType) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== id) return field;
        if (type === 'boolean') return { ...field, type, value: field.value === 'true' ? 'true' : 'false' };
        return { ...field, type };
      }),
    );
    if (error) setError(null);
  };

  const removeField = (id: string) => {
    setFields((prev) => (prev.length > 1 ? prev.filter((field) => field.id !== id) : prev));
  };

  const addField = () => setFields((prev) => [...prev, createEmptyField()]);

  // --------------------------------------------------------

  const handleSubmit = async () => {
    const normalizedKey = keyValue.trim();

    if (!normalizedKey) {
      setError('کلید تنظیم را وارد کنید.');
      return;
    }

    const result = fieldsToData(fields);
    if ('error' in result) {
      setError(result.error);
      return;
    }

    const saved = await upsertSetting(normalizedKey, { data: result.data, isPrivate });
    if (!saved) return;

    toast.success(mode === 'create' ? 'تنظیم ایجاد شد.' : 'تنظیم ذخیره شد.');
    onSaved(saved);
    onOpenChange(false);
  };

  // --------------------------------------------------------

  const footer = (
    <div className='flex flex-row items-center justify-end gap-3'>
      <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' disabled={loading} onClick={() => onOpenChange(false)}>
        انصراف
      </Button>

      <Button type='button' className='h-11 rounded-xl px-6' disabled={loading} onClick={() => void handleSubmit()}>
        {loading && <Spinner />}
        {mode === 'create' ? 'ایجاد تنظیم' : 'ذخیره تغییرات'}
      </Button>
    </div>
  );

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === 'create' ? 'تنظیم جدید' : `ویرایش «${initial?.key ?? ''}»`}
      footer={footer}
      size='lg'>
      <div className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {/* Key */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor='setting-key' className='text-sm text-secondary-1'>
              کلید
            </Label>

            <div className='relative'>
              <KeyRound className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
              <Input
                id='setting-key'
                dir='ltr'
                value={keyValue}
                disabled={mode === 'edit'}
                placeholder='مثلا slogan'
                className='h-11 ps-8 font-medium'
                onChange={(event) => {
                  setKeyValue(event.target.value);
                  if (error) setError(null);
                }}
              />
            </div>

            <p className='text-caption text-secondary-3'>حروف انگلیسی، عدد، «-» و «_».</p>
          </div>

          {/* Private */}
          <div className='flex flex-col gap-2'>
            <Label className='text-sm text-secondary-1'>دسترسی</Label>
            <div className='flex h-11 items-center justify-between rounded-lg border border-gray-2 px-3'>
              <span className='text-regular text-secondary-2'>{isPrivate ? 'خصوصی (فقط کاربران واردشده)' : 'عمومی'}</span>
              <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
            </div>
          </div>
        </div>

        {/* Data fields */}
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-secondary-black-3'>داده‌ها</span>
            <Button type='button' variant='outline' size='sm' className='h-8 rounded-lg border-gray-2' onClick={addField}>
              <Plus />
              افزودن فیلد
            </Button>
          </div>

          <div className='flex flex-col gap-3'>
            {fields.map((field) => (
              <div key={field.id} className='flex flex-col gap-2 rounded-xl border border-gray-1 p-3'>
                <div className='flex items-center gap-2'>
                  <Input
                    dir='ltr'
                    value={field.key}
                    placeholder='کلید فیلد'
                    className='h-10 flex-1 font-medium'
                    onChange={(event) => updateField(field.id, { key: event.target.value })}
                  />

                  <Select value={field.type} onValueChange={(value) => changeFieldType(field.id, value as SettingFieldType)}>
                    <SelectTrigger className='!h-10 w-28' dir='rtl'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position='popper' dir='rtl' className='z-50'>
                      {FIELD_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {FIELD_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
                    title='حذف فیلد'
                    disabled={fields.length === 1}
                    onClick={() => removeField(field.id)}>
                    <Trash2 />
                  </Button>
                </div>

                {field.type === 'boolean' ? (
                  <div className='flex h-10 items-center justify-between rounded-lg border border-gray-2 px-3'>
                    <span className='text-regular text-secondary-2'>{field.value === 'true' ? 'فعال' : 'غیرفعال'}</span>
                    <Switch
                      checked={field.value === 'true'}
                      onCheckedChange={(checked) => updateField(field.id, { value: checked ? 'true' : 'false' })}
                    />
                  </div>
                ) : field.type === 'json' ? (
                  <Textarea
                    dir='ltr'
                    rows={3}
                    value={field.value}
                    placeholder='{ "key": "value" }'
                    className='resize-y font-mono text-xs'
                    onChange={(event) => updateField(field.id, { value: event.target.value })}
                  />
                ) : (
                  <Input
                    dir={field.type === 'number' ? 'ltr' : 'auto'}
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={field.value}
                    placeholder='مقدار'
                    className='h-10'
                    onChange={(event) => updateField(field.id, { value: event.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <p className='text-sm text-custom-red'>{error}</p>}
      </div>
    </ReusableModal>
  );
}
