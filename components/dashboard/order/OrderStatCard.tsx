'use client';

import { InfoCircle, ChartCircle, House, TickCircle, Danger, CloseCircle, MoneyRecive, MoneyChange } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';

interface OrderStatCardProps {
  title: string;
  count: number;
  statusId: number;
}

export default function OrderStatCard({ title, count, statusId }: OrderStatCardProps) {
  const getStatusClassIcon = (statusId: number) => {
    switch (statusId) {
      case -1:
        return 'bg-[#F59E0B]/20 text-[#F59E0B]';

      case 0:
        return 'bg-[#3B82F6]/20 text-[#3B82F6]';

      case 1:
        return 'bg-[#06B6D4]/20 text-[#06B6D4]';

      case 2:
        return 'bg-[#22C55E]/20 text-[#22C55E]';

      case 3:
        return 'bg-[#F97316]/20 text-[#F97316]';

      case 4:
        return 'bg-[#EF4444]/20 text-[#EF4444]';

      case 5:
        return 'bg-[#64748B]/20 text-[#64748B]';

      case 6:
        return 'bg-[#8B5CF6]/20 text-[#8B5CF6]';

      default:
        return 'bg-[#8B5CF6]/20 text-[#8B5CF6]';
    }
  };

  const getStatusClassLabel = (statusId: number) => {
    switch (statusId) {
      case -1:
        return 'text-[#F59E0B]';

      case 0:
        return 'text-[#3B82F6]';

      case 1:
        return 'text-[#06B6D4]';

      case 2:
        return 'text-[#22C55E]';

      case 3:
        return 'text-[#F97316]';

      case 4:
        return 'text-[#EF4444]';

      case 5:
        return 'text-[#64748B]';

      case 6:
        return 'text-[#8B5CF6]';

      default:
        return 'text-[#8B5CF6]';
    }
  };

  const getStatusIcon = (statusId: number) => {
    switch (statusId) {
      case -1:
        return InfoCircle;

      case 0:
        return ChartCircle;

      case 1:
        return House;

      case 2:
        return TickCircle;

      case 3:
        return Danger;

      case 4:
        return CloseCircle;

      case 5:
        return MoneyRecive;

      case 6:
        return MoneyChange;

      default:
        return InfoCircle;
    }
  };

  const getStatusClassBorder = (statusId: number) => {
    switch (statusId) {
      case -1:
        return 'border-[#F59E0B]/20';

      case 0:
        return 'border-[#3B82F6]/20';

      case 1:
        return 'border-[#06B6D4]/20';

      case 2:
        return 'border-[#22C55E]/20';

      case 3:
        return 'border-[#F97316]/20';

      case 4:
        return 'border-[#EF4444]/20';

      case 5:
        return 'border-[#64748B]/20';

      case 6:
        return 'border-[#8B5CF6]/20';

      default:
        return 'border-[#8B5CF6]/20';
    }
  };

  return (
    <div className={`flex flex-1 items-center gap-3 rounded-xl border bg-white px-4 py-3 sm:gap-4 sm:p-4 ${getStatusClassBorder(statusId)}`}>
      <Icon
        IconComponent={getStatusIcon(statusId)}
        className={`shrink-0 rounded-full p-2 ${getStatusClassIcon(statusId)}`}
        variant='Linear'
        size={40}
      />

      <div className='min-w-0 flex-1'>
        <h6 className={`truncate text-xs ${getStatusClassLabel(statusId)}`}>{title}</h6>
      </div>

      <p className={`text-sm ${getStatusClassLabel(statusId)}`}>{count}</p>
    </div>
  );
}
