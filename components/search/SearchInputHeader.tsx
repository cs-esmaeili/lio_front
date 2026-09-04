'use client';

import { CloseCircle, SearchStatus } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';

type Props = {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
};

const SearchInputHeader = ({ value, onChange, onClear }: Props) => {
  return (
    <div className='relative w-full h-full'>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
