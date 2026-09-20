'use client';

import { useMemo } from 'react';
import { separator } from '@/utils/number';
import { cloneParams, toggleArrayParam, setScalarParam } from '@/utils/shop/urlHelpers';
import type { CategoryFilterView } from '@/typescript/schemas/products/category-filters.schema';

export interface FilterChip {
  id: string;
  filterKey: string;
  label: string;
  remove: () => void;
}

export function useActiveFilterChips(
  liveParams: URLSearchParams,
  serverFilters: CategoryFilterView[] | undefined,
  onUrlChange: (params: URLSearchParams) => void
): FilterChip[] {
  return useMemo(() => {
    const chips: FilterChip[] = [];

    for (const filter of serverFilters ?? []) {
      const key = filter.key;

      if (filter.type === 'toggle') {
        if (liveParams.get(key) === '1') {
          chips.push({
            id: `${key}::bool`,
            filterKey: key,
            label: filter.title,
            remove: () => onUrlChange(setScalarParam(liveParams, key, null)),
          });
        }
        continue;
      }

      if (filter.type === 'price') {
        const min = liveParams.get('minPrice');
        const max = liveParams.get('maxPrice');

        if (min == null && max == null) continue;

        const minText = min != null ? separator(Number(min)) : '۰';
        const maxText = max != null ? separator(Number(max)) : '∞';

        chips.push({
          id: `${key}::price`,
          filterKey: key,
          label: `${filter.title}: ${minText} - ${maxText}`,
          remove: () => {
            const next = cloneParams(liveParams);
            next.delete('minPrice');
            next.delete('maxPrice');
            next.delete('page');
            onUrlChange(next);
          },
        });
        continue;
      }

      // Checkbox filters — read from URL using bracket-array keys
      const values = liveParams.getAll(key);
      if (values.length === 0) continue;

      for (const raw of values) {
        const str = String(raw);
        const item = filter.items?.find((it) => String(it.value) === str || String(it.id) === str);
        chips.push({
          id: `${key}::${str}`,
          filterKey: key,
          label: item?.title ?? str,
          remove: () => onUrlChange(toggleArrayParam(liveParams, key, str)),
        });
      }
    }

    return chips;
  }, [liveParams, serverFilters, onUrlChange]);
}
