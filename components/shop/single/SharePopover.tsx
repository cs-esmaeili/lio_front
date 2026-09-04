'use client';

import Icon from '@/components/global/Icon';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  url: string;
};

const SharePopover = ({ url }: Props) => {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('لینک صفحه کپی شد');
    } catch {
      toast.error('خطا در کپی لینک');
    }
  };

  return (
    <button type="button" onClick={handleShare} aria-label="اشتراک‌گذاری" className='cursor-pointer'>
      <Icon IconComponent={Share2} size={20} aria-hidden="true" variant="TwoTone" />
    </button>
  );
};

export default SharePopover;
