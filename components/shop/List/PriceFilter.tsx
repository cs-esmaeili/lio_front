'use client';

import { Input } from '@/components/shadcn/input';
import { Slider } from '@/components/shadcn/slider';
import { separator } from '@/utils/number';
import { useState, useEffect, useRef } from 'react';

interface Props {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceFilter = ({ min = 0, max = 0, value, onChange }: Props) => {
  // local state shown while dragging/typing — committed on release/blur
  const [local, setLocal] = useState<[number, number]>(value);
  const prevValueRef = useRef(value);

  // sync from external URL changes (e.g. chip removal, mobile apply)
  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev[0] !== value[0] || prev[1] !== value[1]) {
      setLocal(value);
      prevValueRef.current = value;
    }
  }, [value]);

  const commit = (pair: [number, number]) => {
    onChange(pair);
  };

  return (
    <>
      <div className="flex flex-row gap-2">
        <div className="flex justify-center items-center gap-2 w-full">
          <span>از</span>
          <Input
            className="h-[34px]"
            value={local[0]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocal([Number(e.target.value), local[1]])
            }
            onBlur={() => commit(local)}
            onKeyDown={(e) => { if (e.key === 'Enter') commit(local); }}
          />
        </div>

        <div className="flex justify-center items-center gap-2 w-full">
          <span>تا</span>
          <Input
            className="h-[34px]"
            value={local[1]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocal([local[0], Number(e.target.value)])
            }
            onBlur={() => commit(local)}
            onKeyDown={(e) => { if (e.key === 'Enter') commit(local); }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="w-full px-[38px]">
          <Slider
            value={local}
            onValueChange={(v: number[]) => setLocal([v[0], v[1]])}
            onValueCommit={(v: number[]) => commit([v[0], v[1]])}
            min={min}
            max={max}
            step={1000}
            dir="rtl"
          />
        </div>

        <div className="flex justify-between w-full">
          <div className="flex flex-col justify-center items-center w-[85px]">
            <span>{separator(local[0])}</span>
            <span>{process.env.NEXT_PUBLIC_CURRENCY}</span>
          </div>
          <div className="flex flex-col justify-center items-center w-[85px]">
            <span>{separator(local[1])}</span>
            <span>{process.env.NEXT_PUBLIC_CURRENCY}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceFilter;
