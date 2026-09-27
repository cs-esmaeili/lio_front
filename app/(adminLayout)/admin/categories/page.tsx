'use client';

import { useMemo, useState } from 'react';
import { ChevronsDownUp, ChevronsUpDown, CircleAlert, Layers, Plus, RefreshCw, Search } from 'lucide-react';

import CategoryEditorModal from '@/components/admin/category-manager/CategoryEditorModal';
import CategoryTree from '@/components/admin/category-manager/CategoryTree';
import ConfirmDeleteCategoryModal from '@/components/admin/category-manager/ConfirmDeleteCategoryModal';
import { buildCategoryTree, filterCategoryTree, type CategoryTreeNode } from '@/components/admin/category-manager/category-manager.model';
import PermissionGate from '@/components/global/PermissionGate';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { useDeleteCategory } from '@/hooks/category/useDeleteCategory';
import { useCategoryList } from '@/hooks/category/useCategoryList';
import { usePermissions } from '@/hooks/auth/usePermissions';
import { PERMISSIONS } from '@/typescript/constants/permissions';
import type { AdminCategory } from '@/typescript/schemas/category.schema';

type EditorState = {
  mode: 'create' | 'edit';
  initial: AdminCategory | null;
  defaultParentId: number | null;
};

export default function AdminCategoriesPage() {
  const { categories, loading, error, refetch } = useCategoryList();
  const { deleteCategory, loading: deleting } = useDeleteCategory();
  const { hasPermission } = usePermissions();

  const canManage = hasPermission(PERMISSIONS.CATEGORY_MANAGE);

  const [search, setSearch] = useState('');
  // Start fully collapsed — branches open on demand.
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const visibleTree = useMemo(() => filterCategoryTree(tree, search), [tree, search]);
  const isFiltering = search.trim().length > 0;
  const allExpanded = categories.length > 0 && categories.every((category) => expandedIds.has(category.id));

  // --------------------------------------------------------

  const toggleExpand = (id: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleExpandAll = () => {
    setExpandedIds(allExpanded ? new Set() : new Set(categories.map((category) => category.id)));
  };

  const openCreate = () => setEditor({ mode: 'create', initial: null, defaultParentId: null });
  const openCreateChild = (node: CategoryTreeNode) => setEditor({ mode: 'create', initial: null, defaultParentId: node.id });
  const openEdit = (node: CategoryTreeNode) => setEditor({ mode: 'edit', initial: node, defaultParentId: null });

  const handleSaved = (category: AdminCategory) => {
    // Open the parent branch so the new/moved node is visible right away.
    if (category.parentId !== null) {
      const parentId = category.parentId;
      setExpandedIds((prev) => new Set(prev).add(parentId));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const removed = await deleteCategory(deleteTarget.id);
    if (!removed) return;

    setDeleteTarget(null);
  };

  // --------------------------------------------------------

  const editorKey = editor
    ? `${editor.mode}:${editor.initial?.id ?? 'new'}:${editor.defaultParentId ?? 'root'}`
    : 'closed';

  return (
    <PermissionGate anyOf={[PERMISSIONS.CATEGORY_READ, PERMISSIONS.CATEGORY_MANAGE]}>
      <div className='flex flex-col gap-6'>
        {/* Header */}
        <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>دسته‌بندی‌ها</h1>
            <p className='text-regular text-secondary-2'>
              دسته‌بندی‌ها به‌صورت هرمی نمایش داده می‌شوند تا رابطه هر دسته با زیردسته‌هایش مشخص باشد.
            </p>
          </div>

          {canManage && (
            <Button type='button' className='h-11 shrink-0 rounded-xl px-5' onClick={openCreate}>
              <Plus />
              دسته‌بندی جدید
            </Button>
          )}
        </div>

        {/* Toolbar */}
        <div className='flex items-center gap-2'>
          <div className='relative min-w-0 flex-1 sm:max-w-80'>
            <Search className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='جستجو بر اساس نام یا اسلاگ...'
              className='h-10 ps-8'
            />
          </div>

          <Button
            type='button'
            variant='outline'
            size='icon-sm'
            className='h-10 w-10 rounded-lg border-gray-2 text-secondary-2'
            title={allExpanded ? 'بستن همه' : 'باز کردن همه'}
            disabled={categories.length === 0}
            onClick={toggleExpandAll}>
            {allExpanded ? <ChevronsDownUp /> : <ChevronsUpDown />}
          </Button>

          <Button
            type='button'
            variant='outline'
            size='icon-sm'
            className='h-10 w-10 rounded-lg border-gray-2 text-secondary-2'
            title='بروزرسانی'
            disabled={loading}
            onClick={() => void refetch()}>
            {loading ? <Spinner /> : <RefreshCw />}
          </Button>

          <span className='ms-auto hidden text-caption text-secondary-2 sm:block'>
            {categories.length.toLocaleString('fa-IR')} دسته‌بندی
          </span>
        </div>

        {/* Tree */}
        {loading && categories.length === 0 ? (
          <div className='flex flex-col gap-2 rounded-2xl border border-gray-1 bg-custom-white p-4'>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className='h-11 animate-pulse rounded-lg bg-gray-1' />
            ))}
          </div>
        ) : error && categories.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
            <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
            <p className='text-regular text-secondary-1'>{error}</p>
            <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
              تلاش دوباره
            </Button>
          </div>
        ) : visibleTree.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
            <Layers className='text-secondary-3' size={36} aria-hidden='true' />
            <p className='text-regular text-secondary-2'>
              {isFiltering ? 'دسته‌بندی‌ای با این جستجو پیدا نشد.' : 'هنوز دسته‌بندی‌ای ثبت نشده است.'}
            </p>
            {!isFiltering && canManage && (
              <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={openCreate}>
                <Plus />
                ایجاد اولین دسته‌بندی
              </Button>
            )}
          </div>
        ) : (
          <div className='rounded-2xl border border-gray-1 bg-custom-white p-3 md:p-4'>
            <CategoryTree
              nodes={visibleTree}
              expandedIds={expandedIds}
              forceExpand={isFiltering}
              canManage={canManage}
              busyId={deleting ? (deleteTarget?.id ?? null) : null}
              onToggle={toggleExpand}
              onAddChild={openCreateChild}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          </div>
        )}

        {/* Modals */}
        <CategoryEditorModal
          key={editorKey}
          open={editor !== null}
          onOpenChange={(open) => {
            if (!open) setEditor(null);
          }}
          mode={editor?.mode ?? 'create'}
          categories={categories}
          initial={editor?.initial ?? null}
          defaultParentId={editor?.defaultParentId ?? null}
          onSaved={handleSaved}
        />

        <ConfirmDeleteCategoryModal
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          category={deleteTarget}
          loading={deleting}
          onConfirm={() => void handleConfirmDelete()}
        />
      </div>
    </PermissionGate>
  );
}
