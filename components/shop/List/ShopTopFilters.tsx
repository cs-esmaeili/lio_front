'use client';

import { Button } from '@/components/shadcn/button';
import { X } from 'lucide-react';
import { useState } from 'react';
import { BorderLabelSelect } from './BorderLabelSelect';

type FilterKey = 'type' | 'origin' | 'size' | 'tar' | 'nicotine' | 'flavor';

interface FiltersState {
    type: string;
    origin: string;
    size: string;
    tar: string;
    nicotine: string;
    flavor: string;
}

const filterOptions = {
    type: [
        { value: 'none', label: 'نوع' },
        { value: 'cigarette', label: 'سیگار' },
        { value: 'electronic', label: 'سیگار الکترونیکی' },
    ],
    origin: [
        { value: 'none', label: 'داخلی / خارجی' },
        { value: 'iranian', label: 'ایرانی' },
        { value: 'foreign', label: 'خارجی' },
    ],
    size: [
        { value: 'none', label: 'سایز' },
        { value: 'king', label: 'کینگ' },
        { value: 'slim', label: 'اسلیم' },
    ],
    tar: [
        { value: 'none', label: 'قطران' },
        { value: 'low', label: 'کم' },
        { value: 'medium', label: 'متوسط' },
        { value: 'high', label: 'زیاد' },
    ],
    nicotine: [
        { value: 'none', label: 'نیکوتین' },
        { value: 'low', label: 'کم' },
        { value: 'medium', label: 'متوسط' },
        { value: 'high', label: 'زیاد' },
    ],
    flavor: [
        { value: 'none', label: 'طعم' },
        { value: 'classic', label: 'کلاسیک' },
        { value: 'mint', label: 'نعنایی' },
        { value: 'fruit', label: 'میوه‌ای' },
    ],
};

export default function ShopTopFilters() {
    const [filters, setFilters] = useState<FiltersState>({
        type: 'none',
        origin: 'none',
        size: 'none',
        tar: 'none',
        nicotine: 'none',
        flavor: 'none',
    });

    const activeFilterCount = Object.values(filters).filter(v => v !== 'none').length;

    const updateFilter = (key: FilterKey, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            type: 'none',
            origin: 'none',
            size: 'none',
            tar: 'none',
            nicotine: 'none',
            flavor: 'none',
        });
    };



    return (
        <div className="bg-white border border-secondary-black-3 rounded-[20px] p-5 shadow-sm overflow-x-hidden" dir="rtl">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-1 w-full min-w-0">
                    {/* Type */}
                    <BorderLabelSelect
                        value={filters.type}
                        onValueChange={(v) => updateFilter('type', v)}
                        options={filterOptions.type}
                        label="نوع"
                        className="w-full"
                    />

                    {/* Origin */}
                    <BorderLabelSelect
                        value={filters.origin}
                        onValueChange={(v) => updateFilter('origin', v)}
                        options={filterOptions.origin}
                        label="داخلی / خارجی"
                        className="w-full"
                    />

                    {/* Size */}
                    <BorderLabelSelect
                        value={filters.size}
                        onValueChange={(v) => updateFilter('size', v)}
                        options={filterOptions.size}
                        label="سایز"
                        className="w-full"
                    />

                    {/* Tar */}
                    <BorderLabelSelect
                        value={filters.tar}
                        onValueChange={(v) => updateFilter('tar', v)}
                        options={filterOptions.tar}
                        label="قطران"
                        className="w-full"
                    />

                    {/* Nicotine */}
                    <BorderLabelSelect
                        value={filters.nicotine}
                        onValueChange={(v) => updateFilter('nicotine', v)}
                        options={filterOptions.nicotine}
                        label="نیکوتین"
                        className="w-full"
                    />

                    {/* Flavor */}
                    <BorderLabelSelect
                        value={filters.flavor}
                        onValueChange={(v) => updateFilter('flavor', v)}
                        options={filterOptions.flavor}
                        label="طعم"
                        className="w-full"
                    />
                </div>

                {activeFilterCount > 0 && (
                    <Button
                        variant="ghost"
                        onClick={resetFilters}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2 whitespace-nowrap"
                    >
                        <X size={18} />
                        پاک کردن
                    </Button>
                )}

           
            </div>
        </div>
    );
}