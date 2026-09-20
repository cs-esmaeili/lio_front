'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/shadcn/input';
import InnerRadioButton from './InnerRadioButton';

interface FilterItem {
  id?: number | string;
  title: string;
  value: string | number;
  slug?: string;
}

interface Props {
  items: FilterItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  searchable?: boolean;
  goToLink?: boolean;
}

export function MultiRaidoButton({
  items,
  selectedValue,
  onSelect,
  searchable = false,
  goToLink = false,
}: Props) {
  const [search, setSearch] = useState('');

  const filtered =
    search.trim() === ''
      ? items
      : items.filter((opt) => opt.title?.toLowerCase().includes(search.toLowerCase()));

  if (goToLink) {
    return (
      <div className="max-w-sm space-y-2 px-1">
        {searchable && (
          <Input
            placeholder="جستجو در گزینه‌ها..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        {filtered.length === 0 && <p className="px-1 text-sm text-muted-foreground">نتیجه‌ای پیدا نشد.</p>}
        <div className="flex flex-col">
          {filtered.map((opt) => (
            <Link
              key={String(opt.id ?? opt.value)}
              href={`/product-category/${opt.slug ?? opt.value}`}
              className="py-1.5 text-sm hover:text-secondary-1 no-underline!"
            >
              {opt.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm space-y-4 px-1">
      {searchable && (
        <Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} />
      )}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground px-1">نتیجه‌ای یافت نشد.</p>
      ) : (
        <InnerRadioButton
          selected={selectedValue}
          onSelect={onSelect}
          items={filtered.map((opt) => ({
            id: opt.id ?? opt.value,
            title: opt.title,
            value: String(opt.value ?? opt.id),
          }))}
        />
      )}
    </div>
  );
}
