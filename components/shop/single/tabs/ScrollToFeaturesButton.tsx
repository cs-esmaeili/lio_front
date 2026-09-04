'use client';

import Icon from '@/components/global/Icon';
import { ArrowLeft } from 'iconsax-reactjs';

export function ScrollToFeaturesButton() {
  const handleClick = () => {
    // Dispatch custom event so TabsClient switches to features tab and scrolls
    window.dispatchEvent(new CustomEvent('switchToFeaturesTab'));
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 rounded-lg py-5 px-4 col-span-2 xl:col-span-1 border border-primary-1 h-16 cursor-pointer"
    >
      <span className="text-sm text-primary-1 whitespace-nowrap">
        مشاهده همه ویژگی ها
      </span>
      <Icon
        IconComponent={ArrowLeft}
        size={24}
        className="text-primary-1 shrink-0"
      />
    </button>
  );
}
