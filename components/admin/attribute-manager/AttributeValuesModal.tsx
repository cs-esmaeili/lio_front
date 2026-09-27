'use client';

import { useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { useAttributeValueMutations } from '@/hooks/attribute/useAttributeValueMutations';
import type { AdminAttribute } from '@/typescript/schemas/attribute.schema';

interface AttributeValuesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attribute: AdminAttribute | null;
  onChanged: (attribute: AdminAttribute) => void;
}

/**
 * Manages an attribute's values in place. It lives on the attributes page so a
 * single screen covers both the attribute and its values.
 */
export default function AttributeValuesModal({ open, onOpenChange, attribute, onChanged }: AttributeValuesModalProps) {
  const { createValue, updateValue, deleteValue, saving, deleting } = useAttributeValueMutations();

  const [newValue, setNewValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const values = attribute?.values ?? [];

  const handleAdd = async () => {
    if (!attribute) return;
    const value = newValue.trim();
    if (!value) return;

    const updated = await createValue(attribute.id, { value });
    if (!updated) return;

    setNewValue('');
    onChanged(updated);
  };

  const handleSaveEdit = async (valueId: number) => {
    const value = editingValue.trim();
    if (!value) return;

    const updated = await updateValue(valueId, { value });
    if (!updated) return;

    setEditingId(null);
    setEditingValue('');
    onChanged(updated);
  };

  const handleDelete = async (valueId: number) => {
    const updated = await deleteValue(valueId);
    setConfirmingId(null);
    if (updated) onChanged(updated);
  };

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={attribute ? `مقادیر «${attribute.title}»` : 'مقادیر ویژگی'}
      size='lg'>
      <div className='flex flex-col gap-5'>
        {/* Add a value */}
        <div className='flex items-center gap-2'>
          <Input
            value={newValue}
            placeholder='مقدار جدید، مثلا «قرمز»'
            className='h-11'
            onChange={(event) => setNewValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void handleAdd();
              }
            }}
          />
          <Button type='button' className='h-11 shrink-0 rounded-xl px-5' disabled={saving || !newValue.trim()} onClick={() => void handleAdd()}>
            {saving ? <Spinner /> : <Plus />}
            افزودن
          </Button>
        </div>

        {values.length === 0 ? (
          <div className='rounded-xl border border-dashed border-gray-2 py-10 text-center'>
            <p className='text-regular text-secondary-2'>هنوز مقداری برای این ویژگی ثبت نشده است.</p>
          </div>
        ) : (
          <ul className='flex flex-col gap-2'>
            {values.map((value) => {
              const isEditing = editingId === value.id;
              const isConfirming = confirmingId === value.id;

              return (
                <li key={value.id} className='flex items-center gap-2 rounded-xl border border-gray-1 px-3 py-2'>
                  {isEditing ? (
                    <>
                      <Input
                        autoFocus
                        value={editingValue}
                        className='h-10'
                        onChange={(event) => setEditingValue(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            void handleSaveEdit(value.id);
                          }
                          if (event.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <Button
                        type='button'
                        size='icon-sm'
                        className='shrink-0 rounded-lg'
                        disabled={saving}
                        title='ذخیره'
                        onClick={() => void handleSaveEdit(value.id)}>
                        {saving ? <Spinner /> : <Check />}
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon-sm'
                        className='shrink-0 rounded-lg text-secondary-2'
                        title='انصراف'
                        onClick={() => setEditingId(null)}>
                        <X />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className='min-w-0 flex-1 truncate text-regular text-secondary-black-3'>{value.value}</span>

                      {isConfirming ? (
                        <>
                          <span className='text-caption text-custom-red'>حذف شود؟</span>
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            className='shrink-0 rounded-lg'
                            disabled={deleting}
                            onClick={() => void handleDelete(value.id)}>
                            {deleting ? <Spinner /> : 'بله'}
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='shrink-0 rounded-lg text-secondary-2'
                            onClick={() => setConfirmingId(null)}>
                            خیر
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-sm'
                            className='shrink-0 rounded-lg text-secondary-2'
                            title='ویرایش'
                            onClick={() => {
                              setEditingId(value.id);
                              setEditingValue(value.value);
                            }}>
                            <Pencil />
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-sm'
                            className='shrink-0 rounded-lg text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
                            title='حذف'
                            onClick={() => setConfirmingId(value.id)}>
                            <Trash2 />
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </ReusableModal>
  );
}
