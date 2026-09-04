'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table';
import { getUniqueAttrTitles, getAttrValue } from './types';
import type { CompareProduct } from './types';

type Props = {
  products: CompareProduct[];
  storedCategory: string;
  onRemove: (barcode: string) => void;
};

const MAX_SLOTS = 4;

export function CompareTable({ products, storedCategory, onRemove }: Props) {
  const emptySlots = Math.max(0, MAX_SLOTS - products.length);
  const attributeTitles = getUniqueAttrTitles(products);

  return (
    <>
      {/* {storedCategory && (
        <p className="mb-4 text-center text-sm text-neutral-500">
          دسته‌بندی: {storedCategory}
        </p>
      )} */}

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32 min-w-[140px]" />

              {products.map((p) => (
                <TableHead key={p.product.barcode} className="min-w-[180px] p-0">
                  <div className="relative px-4 py-3">
                    <button
                      onClick={() => onRemove(p.product.barcode)}
                      className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                      aria-label={`حذف ${p.product.title}`}
                    >
                      ✕
                    </button>

                    <a
                      href={`/product/${p.product.barcode}/${p.product.slug}`}
                      className="block text-center no-underline"
                    >
                      <div className="relative mx-auto mb-2 h-24 w-24 overflow-hidden rounded-lg bg-neutral-100">
                        <Image
                          src={p.product.image}
                          alt={p.product.title}
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                      </div>
                      <h2 className="mx-auto max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-normal text-black hover:text-neutral-700">
                        {p.product.title}
                      </h2>
                    </a>
                  </div>
                </TableHead>
              ))}

              {Array.from({ length: emptySlots }).map((_, i) => (
                <TableHead key={`empty-${i}`} className="min-w-[180px] p-0">
                  <div className="flex items-center justify-center py-8">
                    {/* <Link href="/shop" className="rounded border border-orange-500 px-3 py-1.5 text-sm text-orange-500 hover:bg-orange-50 inline-block no-underline">
                      انتخاب کالا
                    </Link> */}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {attributeTitles.map((title) => (
              <TableRow key={title}>
                <TableCell className="text-center text-[13px] font-medium">
                  {title}
                </TableCell>
                {products.map((p) => (
                  <TableCell key={p.product.barcode} className="text-center text-[13px]">
                    {getAttrValue(p, title)}
                  </TableCell>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <TableCell key={`empty-${i}`} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
