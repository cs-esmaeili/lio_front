'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FieldGroup } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import InnerCheckBox from './InnerCheckBox';

interface FilterItem {
  id?: number | string;
  title: string;
  value: string;
  slug?: string;
}

interface Props {
  items: FilterItem[];
  checkedValues: string[];
  onToggle: (value: string) => void;
  searchable?: boolean;
  goToLink?: boolean;
  baseLink?: string;
}

export function MultiCheckBox({ items, checkedValues, onToggle, searchable = false, goToLink = false, baseLink = '' }: Props) {
  const [search, setSearch] = useState('');

  const filtered = search.trim() === '' ? items : items.filter((opt) => opt.title?.toLowerCase().includes(search.toLowerCase()));

  if (goToLink) {

    return (
      <div className='max-w-sm space-y-2 px-1'>
        {searchable && <Input placeholder='جستجو در گزینه‌ها...' className='py-3 h-10' value={search} onChange={(e) => setSearch(e.target.value)} />}
        {filtered.length === 0 && <p className='px-1 text-sm text-muted-foreground'>نتیجه‌ای پیدا نشد.</p>}
        <div className='flex flex-col'>
          {filtered.map((opt) => (
            <Link key={String(opt.id ?? opt.value)} href={`${baseLink}${opt.slug ?? opt.value}`} className='py-1.5 text-sm no-underline! hover:text-secondary-1'>
              {opt.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-sm space-y-4 px-1'>
      {searchable && <Input placeholder='جستجو در گزینه‌ها...' value={search} onChange={(e) => setSearch(e.target.value)} />}
      <FieldGroup>
        {filtered.length === 0 && <p className='px-1 text-sm text-muted-foreground'>نتیجه‌ای پیدا نشد.</p>}
        {filtered.map((opt) => {
          const val = String(opt.value ?? opt.id);
          return <InnerCheckBox key={val} label={opt.title} checked={checkedValues.includes(val)} onToggle={() => onToggle(val)} />;
        })}
      </FieldGroup>
    </div>
  );
}
