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
    <div className='relative w-full h-full'>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='جستجوی محصولات,دسته بندی ها و...'
        dir='rtl'
        autoFocus={true}
        className={`w-full h-full rounded-xl pr-12 pl-10 outline-none 
          ${'h-12 bg-transparent text-white placeholder:text-white/40'}
        `}
      />

      {value && (
        <button onClick={onClear} className='absolute left-4 top-1/2 -translate-y-1/2 pl-7.5'>
          <Icon IconComponent={CloseCircle} size={32} className={'text-white'} />
        </button>
      )}
    </div>
  );
};

export default SearchInputHeader;
