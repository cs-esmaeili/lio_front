'use client';

import Icon from '@/components/global/Icon';
import { CloseCircle } from 'iconsax-reactjs';
import { useShopContext } from '@/providers/ShopProvider';
import { useActiveFilterChips } from '@/hooks/shop/useActiveFilterChips';

const ActiveFilterChips = ({ className = '' }: { className?: string }) => {
  const { liveParams, onUrlChange, serverFilters } = useShopContext();
  const chips = useActiveFilterChips(liveParams, serverFilters, onUrlChange);

  if (!chips.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 pt-3 pb-2 ${className}`}>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.remove}
          className="flex items-center gap-1.5 bg-primary-3/40 text-secondary-1 rounded-full pl-1.5 pr-3 py-1 text-sm hover:bg-primary-3/60 transition-colors"
        >
          <span>{chip.label}</span>
          <Icon IconComponent={CloseCircle} size={16} variant="Linear" className="text-secondary-2" />
        </button>
      ))}
    </div>
  );
};

export default ActiveFilterChips;
