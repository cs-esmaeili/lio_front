'use client';

import type { KeyboardEvent } from 'react';
import { CloseCircle } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';

type Props = {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onSubmit?: () => void;
};

const SearchInputHeader = ({ value, onChange, onClear, onSubmit }: Props) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div className='relative w-full'>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='جستجوی محصولات، دسته بندی ها و...'
        dir='rtl'
        autoFocus={true}
        className='h-12 w-full rounded-lg border border-gray-2 bg-gray-1 px-4 pl-10 text-sm text-secondary-black-3 outline-none placeholder:text-secondary-2 focus:border-primary-1'
      />

      {value && (
        <button
          type='button'
          onClick={onClear}
          aria-label='پاک کردن جستجو'
          className='absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer'>
          <Icon IconComponent={CloseCircle} size={24} className={'text-secondary-2'} variant='Linear' />
        </button>
      )}
    </div>
  );
};

export default SearchInputHeader;
