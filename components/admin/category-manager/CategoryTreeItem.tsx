'use client';

import { ChevronDown, ChevronLeft, FolderTree, ListChecks, Pencil, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import type { CategoryTreeNode } from './category-manager.model';

interface CategoryTreeItemProps {
  node: CategoryTreeNode;
  /** Ids whose children are currently shown; anything else is collapsed. */
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
  /** Render every branch open (used while filtering). */
  forceExpand: boolean;
  canManage: boolean;
  busyId: number | null;
  onAddChild: (category: CategoryTreeNode) => void;
  onEdit: (category: CategoryTreeNode) => void;
  onDelete: (category: CategoryTreeNode) => void;
  onManageAttributes: (category: CategoryTreeNode) => void;
}

/**
 * One row of the category tree, rendered recursively so nesting is visible at a
 * glance through indentation and expand/collapse toggles.
 */
export default function CategoryTreeItem({
  node,
  expandedIds,
  onToggle,
  forceExpand,
  canManage,
  busyId,
  onAddChild,
  onEdit,
  onDelete,
  onManageAttributes,
}: CategoryTreeItemProps) {
  const hasChildren = node.children.length > 0;
  const expanded = forceExpand || expandedIds.has(node.id);
  const busy = busyId === node.id;

  return (
    <li className='flex flex-col'>
      <div
        className={`group flex items-center gap-2 rounded-lg py-2 pe-2 transition-colors hover:bg-gray-1 ${busy ? 'opacity-50' : ''}`}>
        {/* Indentation guide */}
        <span className='shrink-0' style={{ width: node.depth * 20 }} aria-hidden='true' />

        {/* Expand / collapse */}
        {hasChildren ? (
          <button
            type='button'
            className='grid size-6 shrink-0 place-content-center rounded-md text-secondary-2 transition-colors hover:bg-gray-2 hover:text-secondary-black-3'
            aria-label={expanded ? 'بستن زیردسته‌ها' : 'نمایش زیردسته‌ها'}
            aria-expanded={expanded}
            onClick={() => onToggle(node.id)}>
            {expanded ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
          </button>
        ) : (
          <span className='size-6 shrink-0' aria-hidden='true' />
        )}

        {/* Thumbnail */}
        <span className='grid size-9 shrink-0 place-content-center overflow-hidden rounded-lg border border-gray-1 bg-gray-1'>
          {node.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={node.imageUrl} alt={node.name} className='h-full w-full object-cover' />
          ) : (
            <FolderTree className='text-secondary-3' size={16} aria-hidden='true' />
          )}
        </span>

        {/* Name + slug */}
        <div className='flex min-w-0 flex-1 flex-col'>
          <span className='truncate text-sm font-medium text-secondary-black-3' title={node.name}>
            {node.name}
          </span>
          <span className='truncate text-caption text-secondary-3' dir='ltr' title={node.slug}>
            {node.slug}
          </span>
        </div>

        {/* Badges */}
        <div className='hidden shrink-0 items-center gap-1.5 sm:flex'>
          {node.childCount > 0 && (
            <span className='rounded-full bg-primary-4 px-2 py-0.5 text-caption text-primary-1'>
              {node.childCount.toLocaleString('fa-IR')} زیردسته
            </span>
          )}
          {node.productCount > 0 && (
            <span className='rounded-full bg-gray-1 px-2 py-0.5 text-caption text-secondary-2'>
              {node.productCount.toLocaleString('fa-IR')} محصول
            </span>
          )}
        </div>

        {/* Actions */}
        {canManage && (
          <div className='flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100'>
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              className='text-secondary-2 hover:text-primary-1'
              title='ویژگی‌ها'
              disabled={busy}
              onClick={() => onManageAttributes(node)}>
              <ListChecks />
            </Button>

            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              className='text-secondary-2 hover:text-primary-1'
              title='افزودن زیردسته'
              disabled={busy}
              onClick={() => onAddChild(node)}>
              <Plus />
            </Button>

            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              className='text-secondary-2 hover:text-primary-1'
              title='ویرایش'
              disabled={busy}
              onClick={() => onEdit(node)}>
              <Pencil />
            </Button>

            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
              title='حذف'
              disabled={busy}
              onClick={() => onDelete(node)}>
              <Trash2 />
            </Button>
          </div>
        )}
      </div>

      {hasChildren && expanded && (
        <ul className='flex flex-col'>
          {node.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              node={child}
              expandedIds={expandedIds}
              onToggle={onToggle}
              forceExpand={forceExpand}
              canManage={canManage}
              busyId={busyId}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              onManageAttributes={onManageAttributes}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
