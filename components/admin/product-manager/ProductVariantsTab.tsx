'use client';

import { useState } from 'react';
import { ListChecks, Plus, RefreshCw, Trash2 } from 'lucide-react';

import AddVariantCombinationModal from './AddVariantCombinationModal';
import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { variantCombinationKey, type AdminAvailableAttribute } from '@/typescript/schemas/products/admin-product.schema';
import { buildCombinations, emptyVariantDraft, syncVariantDrafts, type ProductFormState, type VariantDraft } from './product-manager.model';

interface ProductVariantsTabProps {
  state: ProductFormState;
  disabled: boolean;
  attributes: AdminAvailableAttribute[];
  onChange: (patch: Partial<ProductFormState>) => void;
  /** Whether the user may add/remove an attribute's values from here. */
  canManageValues: boolean;
  onManageValues: (attribute: AdminAvailableAttribute) => void;
  /** Reload the attribute list (e.g. after values were added elsewhere). */
  onRefreshAttributes: () => void;
  refreshing: boolean;
}

function valueLabel(attributes: AdminAvailableAttribute[], attributeId: number, valueId: number): { attribute: string; value: string } {
  const attribute = attributes.find((item) => item.id === attributeId);
  const value = attribute?.values.find((item) => item.id === valueId);
  return { attribute: attribute?.title ?? '', value: value?.value ?? '' };
}

export default function ProductVariantsTab({ state, disabled, attributes, onChange, canManageValues, onManageValues, onRefreshAttributes, refreshing }: ProductVariantsTabProps) {
  const variantAttributes = attributes.filter((attribute) => attribute.usage === 'VARIANT');
  const combinations = buildCombinations(state.variantAxes);
  const [addOpen, setAddOpen] = useState(false);

  const toggleAxisValue = (attribute: AdminAvailableAttribute, valueId: number, checked: boolean) => {
    const current = state.variantAxes[attribute.id] ?? [];
    const nextValueIds = checked ? Array.from(new Set([...current, valueId])) : current.filter((id) => id !== valueId);
    const nextAxes = { ...state.variantAxes, [attribute.id]: nextValueIds };
    const nextCombinations = buildCombinations(nextAxes);

    onChange({ variantAxes: nextAxes, variants: syncVariantDrafts(nextCombinations, state.variants) });
  };

  /** Adds (or restores) one specific combination and selects the values it needs. */
  const handleAddCombination = (values: Array<{ attributeId: number; attributeValueId: number }>) => {
    const nextAxes = { ...state.variantAxes };
    for (const value of values) {
      nextAxes[value.attributeId] = Array.from(new Set([...(nextAxes[value.attributeId] ?? []), value.attributeValueId]));
    }

    const nextVariants = syncVariantDrafts(buildCombinations(nextAxes), state.variants);
    const key = variantCombinationKey(values);
    if (nextVariants[key]) nextVariants[key] = { ...nextVariants[key], included: true };

    onChange({ variantAxes: nextAxes, variants: nextVariants });
  };

  if (variantAttributes.length === 0) {
    return (
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 py-8 text-center'>
          <p className='text-regular text-secondary-2'>
            برای دسته‌بندی‌های انتخاب‌شده ویژگی «تنوع» تعریف نشده است؛ محصول یک قیمت و موجودی واحد دارد.
          </p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' disabled={refreshing} onClick={onRefreshAttributes}>
            {refreshing ? <Spinner /> : <RefreshCw />}
            به‌روزرسانی ویژگی‌ها
          </Button>
        </div>
        <VariantBulkAndTable state={state} disabled={disabled} attributes={attributes} onChange={onChange} combinations={combinations} />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <span className='text-sm text-secondary-1'>محورهای تنوع و مقادیرشان</span>
        <div className='flex items-center gap-2'>
          <Button type='button' variant='ghost' size='sm' className='h-9 rounded-lg text-secondary-2' disabled={refreshing} onClick={onRefreshAttributes}>
            {refreshing ? <Spinner /> : <RefreshCw />}
            به‌روزرسانی ویژگی‌ها
          </Button>
          <Button
            type='button'
            className='h-9 rounded-lg'
            disabled={disabled}
            onClick={() => {
              onRefreshAttributes();
              setAddOpen(true);
            }}>
            <Plus />
            افزودن ترکیب
          </Button>
        </div>
      </div>

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

      <AddVariantCombinationModal
        open={addOpen}
        onOpenChange={setAddOpen}
        attributes={variantAttributes}
        onAdd={handleAddCombination}
        refreshing={refreshing}
        onRefresh={onRefreshAttributes}
      />
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

/** Bulk defaults plus the editable variant matrix with add/remove per combination. */
function VariantBulkAndTable({ state, disabled, attributes, onChange, combinations }: VariantBulkAndTableProps) {
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkCompareAt, setBulkCompareAt] = useState('');
  const [bulkStock, setBulkStock] = useState('');

  const isIncluded = (key: string) => state.variants[key]?.included ?? true;
  const includedCombinations = combinations.filter((combination) => isIncluded(combination.key));
  const excludedCombinations = combinations.filter((combination) => !isIncluded(combination.key));

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

  /** Adds a combination back (include) or removes it from the product (exclude). */
  const setIncluded = (key: string, included: boolean) => {
    const current = state.variants[key] ?? emptyVariantDraft(false, included);
    const next: Record<string, VariantDraft> = { ...state.variants, [key]: { ...current, included } };

    if (!included && current.isDefault) {
      next[key] = { ...next[key], isDefault: false };
      const fallbackKey = Object.keys(next).find((candidate) => candidate !== key && next[candidate].included);
      if (fallbackKey) next[fallbackKey] = { ...next[fallbackKey], isDefault: true };
    } else if (included && !Object.entries(next).some(([candidate, draft]) => candidate !== key && draft.included && draft.isDefault)) {
      next[key] = { ...next[key], isDefault: true };
    }

    onChange({ variants: next });
  };

  const applyBulk = () => {
    const next: Record<string, VariantDraft> = {};
    for (const [key, draft] of Object.entries(state.variants)) {
      next[key] = draft.included
        ? {
            ...draft,
            price: bulkPrice.trim() !== '' ? bulkPrice.trim() : draft.price,
            compareAtPrice: bulkCompareAt.trim() !== '' ? bulkCompareAt.trim() : draft.compareAtPrice,
            stock: bulkStock.trim() !== '' ? bulkStock.trim() : draft.stock,
          }
        : draft;
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

      {includedCombinations.length === 0 && (
        <div className='rounded-xl border border-custom-red/30 bg-custom-red/10 px-4 py-3 text-regular text-custom-red'>
          هیچ ترکیبی فعال نیست. حداقل یک ترکیب باید باقی بماند.
        </div>
      )}

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
                <TableHead className='h-11 bg-gray-1/60 px-4 text-xs font-medium text-secondary-2'>حذف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {includedCombinations.map((combination) => {
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
                    <TableCell className='px-4 py-3'>
                      {combination.values.length > 0 && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon-sm'
                          className='rounded-lg text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
                          title='حذف این ترکیب'
                          disabled={disabled}
                          onClick={() => setIncluded(combination.key, false)}>
                          <Trash2 />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {excludedCombinations.length > 0 && (
        <div className='flex flex-col gap-3 rounded-xl border border-dashed border-gray-2 p-4'>
          <span className='text-caption text-secondary-2'>ترکیب‌های حذف‌شده — برای افزودن دوباره، «+» را بزنید.</span>
          <div className='flex flex-wrap gap-2'>
            {excludedCombinations.map((combination) => (
              <div key={combination.key || 'base'} className='flex items-center gap-2 rounded-full border border-gray-1 bg-gray-1/40 py-1 pe-1.5 ps-3'>
                <span className='text-caption text-secondary-2'>
                  {combination.values.length === 0
                    ? 'تک‌حالت'
                    : combination.values.map((value) => {
                        const label = valueLabel(attributes, value.attributeId, value.attributeValueId);
                        return `${label.attribute}: ${label.value}`;
                      }).join('، ')}
                </span>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-xs'
                  className='rounded-full text-primary-1 hover:bg-primary-4'
                  title='افزودن این ترکیب'
                  disabled={disabled}
                  onClick={() => setIncluded(combination.key, true)}>
                  <Plus />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
