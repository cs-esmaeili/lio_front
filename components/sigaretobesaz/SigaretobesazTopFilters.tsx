'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { Input } from '@/components/shadcn/input';
import { BorderLabelSelect } from '@/components/shop/List/BorderLabelSelect';
import { sigaretobesazAttributesCSR } from '@/services/sigaretobesaz.service';
import { AttributesResponseSchema, SigaretobesazAttribute } from '@/typescript/schemas/products/sigaretobesaz.schema';
import { SigaretobesazSearchParams } from '@/utils/sigaretobesaz/buildAttributesQuery';
import { getApiErrorMessage } from '@/utils/api-error';

const NONE = 'none';

const ALLOWED_ATTRIBUTE_IDS = [58, 71, 57, 59];

interface Props {
  onSearch: (params: SigaretobesazSearchParams) => void;
  onReset: () => void;
}

export default function SigaretobesazTopFilters({ onSearch, onReset }: Props) {
  const [attributes, setAttributes] = useState<SigaretobesazAttribute[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState(true);
  const [filters, setFilters] = useState<Record<number, string>>({});
  const [madeIran, setMadeIran] = useState<string>(NONE);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  useEffect(() => {
    let cancelled = false;

    sigaretobesazAttributesCSR()
      .then((response) => {
        if (cancelled) return;

        const parsed = AttributesResponseSchema.safeParse(response.data);
        const list = parsed.success ? parsed.data.filters.attributes : (response.data?.filters?.attributes ?? []);

        // Extract price range from the filters response
        const minAmount = response.data?.filters?.min_amount ?? 0;
        const maxAmount = response.data?.filters?.max_amount ?? 0;
        setPriceRange({ min: minAmount, max: maxAmount });

        const filtered = list.filter((attr: SigaretobesazAttribute) => attr.values.length > 0 && ALLOWED_ATTRIBUTE_IDS.includes(attr.id));

        const ordered = ALLOWED_ATTRIBUTE_IDS.map((id) => filtered.find((attr: SigaretobesazAttribute) => attr.id === id)).filter(
          (attr): attr is SigaretobesazAttribute => Boolean(attr)
        );

        setAttributes(ordered);
      })
      .catch((error) => {
        if (!cancelled) toast.error(getApiErrorMessage(error, 'خطا در دریافت فیلترها'));
      })
      .finally(() => {
        if (!cancelled) setLoadingAttributes(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeFilterCount =
    Object.values(filters).filter((v) => v && v !== NONE).length +
    (madeIran !== NONE ? 1 : 0) +
    (priceFrom ? 1 : 0) +
    (priceTo ? 1 : 0);

  const updateFilter = (attributeId: number, value: string) => {
    setFilters((prev) => ({ ...prev, [attributeId]: value }));
  };

  const resetFilters = () => {
    setFilters({});
    setMadeIran(NONE);
    setPriceFrom('');
    setPriceTo('');
    onReset();
  };

  const handleSearch = () => {
    const selected = Object.entries(filters)
      .filter(([, value]) => value && value !== NONE)
      .map(([attributeId, value]) => ({
        attribute_id: Number(attributeId),
        values: [Number(value)],
      }));

    const params: SigaretobesazSearchParams = {
      attributes: selected,
      madeIran: madeIran !== NONE ? madeIran : null,
      priceFrom: priceFrom ? Number(priceFrom) : null,
      priceTo: priceTo ? Number(priceTo) : null,
    };

    onSearch(params);
  };

  const btnClass = 'w-full h-10 lg:w-auto rounded-lg bg-primary-1 hover:bg-primary-black-1 text-white px-10 whitespace-nowrap';

  return (
    <div className='bg-white border border-secondary-black-3 rounded-[20px] p-5 overflow-x-hidden' dir='rtl'>
      <div className='flex flex-col gap-4'>
        {loadingAttributes ? (
          <div className='flex items-center justify-center w-full'>
            <Spinner className='size-8 text-primary-1' />
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row items-start lg:items-center gap-4 flex-1 w-full min-w-0'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 flex-1 w-full min-w-0'>
              {attributes.map((attr) => (
                <BorderLabelSelect
                  key={attr.id}
                  value={filters[attr.id] ?? NONE}
                  onValueChange={(v) => updateFilter(attr.id, v)}
                  options={[{ value: NONE, label: attr.title }, ...attr.values.map((val) => ({ value: String(val.id), label: val.title }))]}
                  label={attr.title}
                  className='w-full'
                />
              ))}
              <BorderLabelSelect
                value={madeIran}
                onValueChange={setMadeIran}
                options={[
                  { value: NONE, label: 'همه' },
                  { value: '1', label: 'ایرانی' },
                  { value: '0', label: 'خارجی' },
                ]}
                label='نوع محصول'
                className='w-full'
              />
            </div>

            <div className='flex items-center gap-3 whitespace-nowrap'>
              <span className='text-sm text-secondary-2'>قیمت</span>
              <Input
                type='number'
                placeholder='از'
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                className='h-10 w-36 text-right'
                min={priceRange.min}
                max={priceRange.max}
              />
              <Input
                type='number'
                placeholder='تا'
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                className='h-10 w-36 text-right'
                min={priceRange.min}
                max={priceRange.max}
              />
              <span className='text-xs text-secondary-2'>{process.env.NEXT_PUBLIC_CURRENCY}</span>
            </div>
          </div>
        )}

        <div className='flex items-center justify-end gap-3'>
          {activeFilterCount > 0 && (
            <Button
              variant='ghost'
              onClick={resetFilters}
              className='text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2 whitespace-nowrap'>
              <X size={18} />
              پاک کردن
            </Button>
          )}

          <Button onClick={handleSearch} disabled={loadingAttributes} className={btnClass}>
            جستجو
          </Button>
        </div>
      </div>
    </div>
  );
}
