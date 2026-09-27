'use client';

import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnHelper,
  type RowData,
} from '@tanstack/react-table';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';

/**
 * The project-wide table feature set. Every admin list uses this DataTable so
 * sorting, empty and loading states stay identical across pages.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

/** Column helper bound to the shared feature set. Create one per row type. */
export function createAppColumnHelper<TData extends RowData>() {
  return createColumnHelper<typeof dataTableFeatures, TData>();
}

/** The exact column array shape produced by `columnHelper.columns([...])`. */
export type DataTableColumns<TData extends RowData> = ReturnType<ColumnHelper<typeof dataTableFeatures, TData>['columns']>;

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumns<TData>;
  data: TData[];
  /** Stable row id, required when rows can be reordered or selected. */
  getRowId?: (row: TData) => string;
  isLoading?: boolean;
  /** Message shown when there are no rows. */
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  /** Optional action rendered next to the empty message. */
  emptyAction?: ReactNode;
  skeletonRows?: number;
  /** Turn client-side sorting off for server-paginated lists. Defaults to `true`. */
  enableSorting?: boolean;
}

/** Shared admin table built on the shadcn `Table` primitives. */
export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  isLoading = false,
  emptyMessage = 'موردی ثبت نشده است.',
  emptyIcon: EmptyIcon,
  emptyAction,
  skeletonRows = 6,
  enableSorting = true,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    defaultColumn: { sortFn: 'alphanumeric', enableSorting },
    ...(getRowId ? { getRowId } : {}),
  });

  const rows = table.getRowModel().rows;
  const columnCount = table.getAllColumns().length || 1;

  return (
    <div className='overflow-hidden rounded-2xl border border-gray-1 bg-custom-white'>
      <div className='w-full overflow-x-auto'>
        <Table className='min-w-full'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='border-gray-1 hover:bg-transparent'>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='h-12 bg-gray-1/60 px-4 text-xs font-medium text-secondary-2'>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type='button'
                        className='inline-flex items-center gap-1.5 whitespace-nowrap text-secondary-2 transition-colors hover:text-secondary-black-3'
                        onClick={header.column.getToggleSortingHandler()}>
                        <table.FlexRender header={header} />
                        {header.column.getIsSorted() === 'asc' ? (
                          <ArrowUp className='size-3.5' aria-hidden='true' />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ArrowDown className='size-3.5' aria-hidden='true' />
                        ) : (
                          <ChevronsUpDown className='size-3.5 opacity-50' aria-hidden='true' />
                        )}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} className='border-gray-1'>
                  {Array.from({ length: columnCount }).map((__, cellIndex) => (
                    <TableCell key={`skeleton-${rowIndex}-${cellIndex}`} className='px-4 py-4'>
                      <div className='h-4 w-full max-w-40 animate-pulse rounded bg-gray-1' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow className='border-0 hover:bg-transparent'>
                <TableCell colSpan={columnCount} className='px-4 py-16'>
                  <div className='flex flex-col items-center justify-center gap-3 text-center'>
                    {EmptyIcon && <EmptyIcon className='text-secondary-3' size={34} aria-hidden='true' />}
                    <p className='text-regular text-secondary-2'>{emptyMessage}</p>
                    {emptyAction}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className='border-gray-1'>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id} className='px-4 py-3 text-regular text-secondary-black-3'>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

/** Server-side pagination footer that pairs with the DataTable. */
export function DataTablePagination({ page, totalPages, onPageChange, disabled = false }: DataTablePaginationProps) {
  const safeTotal = Math.max(1, totalPages);

  return (
    <div className='flex flex-col items-center justify-between gap-3 rounded-2xl border border-gray-1 bg-custom-white px-4 py-3 sm:flex-row'>
      <span className='text-caption text-secondary-2'>
        صفحه {page.toLocaleString('fa-IR')} از {safeTotal.toLocaleString('fa-IR')}
      </span>

      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          className='h-9 rounded-lg border-gray-2'
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}>
          قبلی
        </Button>

        {disabled && <Spinner className='size-4 text-secondary-2' />}

        <Button
          type='button'
          variant='outline'
          className='h-9 rounded-lg border-gray-2'
          disabled={disabled || page >= safeTotal}
          onClick={() => onPageChange(page + 1)}>
          بعدی
        </Button>
      </div>
    </div>
  );
}
