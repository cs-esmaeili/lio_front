'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronLeft, CircleAlert, FolderTree, RefreshCw, Search } from 'lucide-react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { useCategoryList } from '@/hooks/category/useCategoryList';
import type { AdminCategory } from '@/typescript/schemas/category.schema';
import {
  buildCategoryTree,
  filterCategoryTree,
  getDescendantIds,
  type CategoryTreeNode,
} from './category-manager.model';

export interface CategoryPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Modal title. */
  title?: string;
  /** Allow selecting more than one category. */
  multiple?: boolean;
  /** Pre-selected category ids. */
  selectedIds?: number[];
  /** Ids that cannot be picked; their descendants are disabled too (e.g. self when moving). */
  disabledIds?: number[];
  /** Offer a "root / no category" choice; confirming it calls `onSelect([])`. */
  allowRootOption?: boolean;
  rootLabel?: string;
  /** Chosen categories when the user confirms (`[]` for the root choice). */
  onSelect?: (categories: AdminCategory[]) => void;
  /** Close the dialog after `onSelect`. Default `true`. */
  closeOnSelect?: boolean;
  /** Modal width. */
  size?: 'md' | 'lg' | 'xl';
}

interface PickerRowProps {
  node: CategoryTreeNode;
  collapsedIds: Set<number>;
  onToggle: (id: number) => void;
  selected: Set<number>;
  disabled: Set<number>;
  multiple: boolean;
  onPick: (id: number) => void;
}

/** One selectable row of the picker tree. */
function PickerRow({ node, collapsedIds, onToggle, selected, disabled, multiple, onPick }: PickerRowProps) {
  const hasChildren = node.children.length > 0;
  const expanded = !collapsedIds.has(node.id);
  const isSelected = selected.has(node.id);
  const isDisabled = disabled.has(node.id);

  return (
    <li className='flex flex-col'>
      <div
        role='button'
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
        aria-pressed={isSelected}
        className={`flex items-center gap-2 rounded-lg py-2 pe-2 transition-colors ${
          isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-gray-1'
        }`}
        onClick={() => !isDisabled && onPick(node.id)}
        onKeyDown={(event) => {
          if (isDisabled) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onPick(node.id);
          }
        }}>
        <span className='shrink-0' style={{ width: node.depth * 20 }} aria-hidden='true' />

        {hasChildren ? (
          <button
            type='button'
            className='grid size-6 shrink-0 place-content-center rounded-md text-secondary-2 transition-colors hover:bg-gray-2 hover:text-secondary-black-3'
            aria-label={expanded ? 'بستن زیردسته‌ها' : 'نمایش زیردسته‌ها'}
            onClick={(event) => {
              event.stopPropagation();
              onToggle(node.id);
            }}>
            {expanded ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
          </button>
        ) : (
          <span className='size-6 shrink-0' aria-hidden='true' />
        )}

        <span className='grid size-8 shrink-0 place-content-center overflow-hidden rounded-lg border border-gray-1 bg-gray-1'>
          {node.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={node.imageUrl} alt={node.name} className='h-full w-full object-cover' />
          ) : (
            <FolderTree className='text-secondary-3' size={15} aria-hidden='true' />
          )}
        </span>

        <div className='flex min-w-0 flex-1 flex-col'>
          <span className='truncate text-sm font-medium text-secondary-black-3'>{node.name}</span>
          <span className='truncate text-caption text-secondary-3' dir='ltr'>
            {node.slug}
          </span>
        </div>

        <span
          className={`grid size-5 shrink-0 place-content-center border transition-colors ${
            multiple ? 'rounded-md' : 'rounded-full'
          } ${isSelected ? 'border-primary-1 bg-primary-1 text-custom-white' : 'border-gray-2 text-transparent'}`}
          aria-hidden='true'>
          <Check size={13} />
        </span>
      </div>

      {hasChildren && expanded && (
        <ul className='flex flex-col'>
          {node.children.map((child) => (
            <PickerRow
              key={child.id}
              node={child}
              collapsedIds={collapsedIds}
              onToggle={onToggle}
              selected={selected}
              disabled={disabled}
              multiple={multiple}
              onPick={onPick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Reusable hierarchical category picker — the category counterpart of
 * `FileManagerDialog`. Drop it anywhere and drive it with `open`/`onSelect`;
 * it reads from the shared `categoryStore` so the tree is fetched once.
 */
export default function CategoryPickerDialog({
  open,
  onOpenChange,
  title,
  multiple = false,
  selectedIds,
  disabledIds,
  allowRootOption = false,
  rootLabel = 'سطح اصلی (بدون والد)',
  onSelect,
  closeOnSelect = true,
  size = 'lg',
}: CategoryPickerDialogProps) {
  const { categories, loading, error, refetch } = useCategoryList({ enabled: open });

  const [selection, setSelection] = useState<Set<number>>(new Set());
  const [rootSelected, setRootSelected] = useState(false);
  const [search, setSearch] = useState('');
  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set());
  const [prevOpen, setPrevOpen] = useState(open);

  const selectedKey = (selectedIds ?? []).join(',');
  const disabledKey = (disabledIds ?? []).join(',');

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const visibleTree = useMemo(() => filterCategoryTree(tree, search), [tree, search]);

  // Reset the transient selection every time the dialog toggles (adjusting state
  // during render is the recommended alternative to a sync effect).
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSelection(new Set(selectedKey ? selectedKey.split(',').map(Number) : []));
      setRootSelected(false);
      setSearch('');
      setCollapsedIds(new Set());
    } else {
      setSelection(new Set());
    }
  }

  const disabledSet = useMemo(() => {
    const ids = disabledKey ? disabledKey.split(',').map(Number) : [];
    const set = new Set(ids);
    for (const id of ids) {
      for (const descendantId of getDescendantIds(categories, id)) set.add(descendantId);
    }
    return set;
  }, [disabledKey, categories]);

  const toggleExpand = (id: number) =>
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const pick = (id: number) => {
    setRootSelected(false);
    setSelection((prev) => {
      if (!multiple) return new Set([id]);
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pickRoot = () => {
    setSelection(new Set());
    setRootSelected(true);
  };

  const selectedCategories = useMemo(
    () => categories.filter((category) => selection.has(category.id)),
    [categories, selection],
  );

  const confirmedSelection = rootSelected ? [] : selectedCategories;
  const canConfirm = rootSelected || selectedCategories.length > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onSelect?.(confirmedSelection);
    if (closeOnSelect) onOpenChange(false);
  };

  const footer = (
    <div className='flex flex-row items-center justify-between gap-3'>
      <span className='text-caption text-secondary-2'>
        {rootSelected
          ? rootLabel
          : selectedCategories.length > 0
            ? `${selectedCategories.length.toLocaleString('fa-IR')} دسته‌بندی انتخاب شده`
            : 'دسته‌بندی انتخاب نشده است'}
      </span>

      <div className='flex flex-row items-center gap-3'>
        <Button
          type='button'
          variant='outline'
          className='h-11 rounded-xl border-gray-2'
          onClick={() => onOpenChange(false)}>
          انصراف
        </Button>

        <Button type='button' className='h-11 rounded-xl px-6' disabled={!canConfirm} onClick={handleConfirm}>
          {multiple ? 'افزودن انتخاب‌شده‌ها' : 'انتخاب'}
        </Button>
      </div>
    </div>
  );

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={title ?? 'انتخاب دسته‌بندی'}
      footer={footer}
      size={size}
      contentClassName='!p-0'>
      <div className='flex flex-col'>
        {/* Search */}
        <div className='relative border-b border-gray-1 p-4'>
          <Search className='pointer-events-none absolute top-1/2 start-6 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
          <Input
            value={search}
            placeholder='جستجو بر اساس نام یا اسلاگ...'
            className='h-10 ps-8'
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className='min-h-[45vh] p-2'>
          {loading && categories.length === 0 ? (
            <div className='grid min-h-[40vh] place-content-center'>
              <Spinner className='size-7 text-primary-1' />
            </div>
          ) : error && categories.length === 0 ? (
            <div className='flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center'>
              <CircleAlert className='text-custom-red' size={30} aria-hidden='true' />
              <p className='text-regular text-secondary-1'>{error}</p>
              <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
                <RefreshCw />
                تلاش دوباره
              </Button>
            </div>
          ) : (
            <div className='flex flex-col gap-1'>
              {allowRootOption && (
                <div
                  role='button'
                  tabIndex={0}
                  aria-pressed={rootSelected}
                  className='flex cursor-pointer items-center gap-3 rounded-lg border border-gray-1 px-3 py-2.5 transition-colors hover:bg-gray-1'
                  onClick={pickRoot}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      pickRoot();
                    }
                  }}>
                  <span className='grid size-8 shrink-0 place-content-center rounded-lg bg-gray-1'>
                    <FolderTree className='text-secondary-2' size={15} aria-hidden='true' />
                  </span>
                  <span className='flex-1 text-sm font-medium text-secondary-black-3'>{rootLabel}</span>
                  <span
                    className={`grid size-5 shrink-0 place-content-center rounded-full border transition-colors ${
                      rootSelected ? 'border-primary-1 bg-primary-1 text-custom-white' : 'border-gray-2 text-transparent'
                    }`}
                    aria-hidden='true'>
                    <Check size={13} />
                  </span>
                </div>
              )}

              {visibleTree.length === 0 ? (
                <div className='flex min-h-[30vh] flex-col items-center justify-center gap-2 text-center'>
                  <FolderTree className='text-secondary-3' size={30} aria-hidden='true' />
                  <p className='text-regular text-secondary-2'>
                    {search.trim() ? 'دسته‌بندی‌ای با این جستجو پیدا نشد.' : 'هنوز دسته‌بندی‌ای ثبت نشده است.'}
                  </p>
                </div>
              ) : (
                <ul className='flex flex-col'>
                  {visibleTree.map((node) => (
                    <PickerRow
                      key={node.id}
                      node={node}
                      collapsedIds={collapsedIds}
                      onToggle={toggleExpand}
                      selected={selection}
                      disabled={disabledSet}
                      multiple={multiple}
                      onPick={pick}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </ReusableModal>
  );
}
