'use client';

import { useState } from 'react';
import { ListChecks } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Input } from '@/components/shadcn/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import type { AdminAvailableAttribute } from '@/typescript/schemas/products/admin-product.schema';
import { buildCombinations, emptyVariantDraft, syncVariantDrafts, type ProductFormState, type VariantDraft } from './product-manager.model';

interface ProductVariantsTabProps {
  state: ProductFormState;
  disabled: boolean;
  attributes: AdminAvailableAttribute[];
  onChange: (patch: Partial<ProductFormState>) => void;
  /** Whether the user may add/remove an attribute's values from here. */
  canManageValues: boolean;
  onManageValues: (attribute: AdminAvailableAttribute) => void;
}

function valueLabel(attributes: AdminAvailableAttribute[], attributeId: number, valueId: number): { attribute: string; value: string } {
  const attribute = attributes.find((item) => item.id === attributeId);
  const value = attribute?.values.find((item) => item.id === valueId);
  return { attribute: attribute?.title ?? '', value: value?.value ?? '' };
}

export default function ProductVariantsTab({ state, disabled, attributes, onChange, canManageValues, onManageValues }: ProductVariantsTabProps) {
  const variantAttributes = attributes.filter((attribute) => attribute.usage === 'VARIANT');
  const combinations = buildCombinations(state.variantAxes);

  const toggleAxisValue = (attribute: AdminAvailableAttribute, valueId: number, checked: boolean) => {
    const current = state.variantAxes[attribute.id] ?? [];
    const nextValueIds = checked ? Array.from(new Set([...current, valueId])) : current.filter((id) => id !== valueId);
    const nextAxes = { ...state.variantAxes, [attribute.id]: nextValueIds };
    const nextCombinations = buildCombinations(nextAxes);

    onChange({ variantAxes: nextAxes, variants: syncVariantDrafts(nextCombinations, state.variants) });
  };

  if (variantAttributes.length === 0) {
    return (
      <div className='flex flex-col gap-5'>
        <div className='rounded-2xl border border-dashed border-gray-2 py-8 text-center'>
          <p className='text-regular text-secondary-2'>
            برای دسته‌بندی‌های انتخاب‌شده ویژگی «تنوع» تعریف نشده است؛ محصول یک قیمت و موجودی واحد دارد.
          </p>
        </div>
        <VariantBulkAndTable state={state} disabled={disabled} attributes={attributes} onChange={onChange} combinations={combinations} />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5'>
      {/* Axis value selection */}
      <div className='flex flex-col gap-4'>
        {variantAttributes.map((attribute) => {
          const selected = state.variantAxes[attribute.id] ?? [];
          return (
            <div key={attribute.id} className='flex flex-col gap-3 rounded-xl border border-gray-1 p-4'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='text-sm font-medium text-secondary-black-3'>{attribute.title}</span>
                <span className='text-caption text-secondary-3'>مقادیر سازنده تنوع را انتخاب کنید</span>

                {canManageValues && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='ms-auto h-8 rounded-lg text-primary-1 hover:bg-primary-4'
                    title='افزودن یا حذف مقادیر این ویژگی'
                    disabled={disabled}
                    onClick={() => onManageValues(attribute)}>
                    <ListChecks />
                    مقادیر
                  </Button>
                )}
              </div>
              <div className='flex flex-wrap gap-x-6 gap-y-2'>
                {attribute.values.map((value) => (
                  <label key={value.id} className='flex cursor-pointer items-center gap-2 text-regular text-secondary-1'>
                    <Checkbox checked={selected.includes(value.id)} disabled={disabled} onCheckedChange={(next) => toggleAxisValue(attribute, value.id, next === true)} />
                    {value.value}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <VariantBulkAndTable state={state} disabled={disabled} attributes={attributes} onChange={onChange} combinations={combinations} />
    </div>
  );
}

interface VariantBulkAndTableProps {
  state: ProductFormState;
  disabled: boolean;
  attributes: AdminAvailableAttribute[];
  onChange: (patch: Partial<ProductFormState>) => void;
  combinations: ReturnType<typeof buildCombinations>;
}

/** Bulk defaults plus the editable variant matrix. */
function VariantBulkAndTable({ state, disabled, attributes, onChange, combinations }: VariantBulkAndTableProps) {
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkCompareAt, setBulkCompareAt] = useState('');
  const [bulkStock, setBulkStock] = useState('');

  const updateDraft = (key: string, patch: Partial<VariantDraft>) => {
    const current = state.variants[key] ?? emptyVariantDraft();
    onChange({ variants: { ...state.variants, [key]: { ...current, ...patch } } });
  };

  const setDefault = (key: string) => {
    const next: Record<string, VariantDraft> = {};
    for (const [combinationKey, draft] of Object.entries(state.variants)) {
      next[combinationKey] = { ...draft, isDefault: combinationKey === key };
    }
    onChange({ variants: next });
  };

  const applyBulk = () => {
    const next: Record<string, VariantDraft> = {};
    for (const [key, draft] of Object.entries(state.variants)) {
      next[key] = {
        ...draft,
        price: bulkPrice.trim() !== '' ? bulkPrice.trim() : draft.price,
        compareAtPrice: bulkCompareAt.trim() !== '' ? bulkCompareAt.trim() : draft.compareAtPrice,
        stock: bulkStock.trim() !== '' ? bulkStock.trim() : draft.stock,
      };
    }
    onChange({ variants: next });
  };

  return (
    <>
      {/* Bulk edit */}
      <div className='flex flex-col gap-3 rounded-xl border border-gray-1 bg-gray-1/40 p-4 md:flex-row md:items-end'>
        <div className='grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3'>
          <div className='flex flex-col gap-1.5'>
            <span className='text-caption text-secondary-2'>قیمت</span>
            <Input dir='ltr' value={bulkPrice} placeholder='1694000' className='h-10' disabled={disabled} onChange={(event) => setBulkPrice(event.target.value)} />
          </div>
          <div className='flex flex-col gap-1.5'>
            <span className='text-caption text-secondary-2'>قیمت قبل از تخفیف</span>
            <Input dir='ltr' value={bulkCompareAt} placeholder='1744000' className='h-10' disabled={disabled} onChange={(event) => setBulkCompareAt(event.target.value)} />
          </div>
          <div className='flex flex-col gap-1.5'>
            <span className='text-caption text-secondary-2'>موجودی</span>
            <Input dir='ltr' value={bulkStock} placeholder='12' className='h-10' disabled={disabled} onChange={(event) => setBulkStock(event.target.value)} />
          </div>
        </div>
        <Button type='button' variant='outline' className='h-10 shrink-0 rounded-lg border-gray-2' disabled={disabled} onClick={applyBulk}>
          اعمال به همه
        </Button>
      </div>

      <div className='overflow-hidden rounded-xl border border-gray-1'>
        <div className='w-full overflow-x-auto'>
          <Table className='min-w-full'>
            <TableHeader>
              <TableRow className='border-gray-1'>
                <TableHead className='h-11 bg-gray-1/60 px-4 text-xs font-medium text-secondary-2'>ترکیب</TableHead>
                <TableHead className='h-11 bg-gray-1/60 px-4 text-xs font-medium text-secondary-2'>SKU</TableHead>
                <TableHead className='h-11 bg-gray-1/60 px-4 text-xs font-medium text-secondary-2'>قیمت</TableHead>
                <TableHead className='h-11 bg-gray-1/60 px-4 text-xs font-medium text-secondary-2'>قیمت قبل</TableHead>
                <TableHead className='h-11 bg-gray-1/60 px-4 text-xs font-medium text-secondary-2'>موجودی</TableHead>
                <TableHead className='h-11 bg-gray-1/60 px-4 text-xs font-medium text-secondary-2'>پیش‌فرض</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {combinations.map((combination) => {
                const draft = state.variants[combination.key] ?? emptyVariantDraft();

                return (
                  <TableRow key={combination.key || 'base'} className='border-gray-1'>
                    <TableCell className='px-4 py-3'>
                      {combination.values.length === 0 ? (
                        <span className='text-caption text-secondary-2'>تک‌حالت</span>
                      ) : (
                        <div className='flex flex-wrap gap-1'>
                          {combination.values.map((value) => {
                            const label = valueLabel(attributes, value.attributeId, value.attributeValueId);
                            return (
                              <span key={`${value.attributeId}-${value.attributeValueId}`} className='rounded-full bg-gray-1 px-2 py-0.5 text-caption text-secondary-1'>
                                {label.attribute}: {label.value}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='px-4 py-3'>
                      <Input
                        dir='ltr'
                        value={draft.sku}
                        placeholder='خودکار'
                        className='h-9 w-36'
                        disabled={disabled}
                        onChange={(event) => updateDraft(combination.key, { sku: event.target.value })}
                      />
                    </TableCell>
                    <TableCell className='px-4 py-3'>
                      <Input
                        dir='ltr'
                        value={draft.price}
                        placeholder='0'
                        className='h-9 w-28'
                        disabled={disabled}
                        onChange={(event) => updateDraft(combination.key, { price: event.target.value })}
                      />
                    </TableCell>
                    <TableCell className='px-4 py-3'>
                      <Input
                        dir='ltr'
                        value={draft.compareAtPrice}
                        placeholder='—'
                        className='h-9 w-28'
                        disabled={disabled}
                        onChange={(event) => updateDraft(combination.key, { compareAtPrice: event.target.value })}
                      />
                    </TableCell>
                    <TableCell className='px-4 py-3'>
                      <Input
                        dir='ltr'
                        value={draft.stock}
                        placeholder='0'
                        className='h-9 w-20'
                        disabled={disabled}
                        onChange={(event) => updateDraft(combination.key, { stock: event.target.value })}
                      />
                    </TableCell>
                    <TableCell className='px-4 py-3'>
                      <Checkbox checked={draft.isDefault} disabled={disabled} onCheckedChange={() => setDefault(combination.key)} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
