'use client';

import { Switch } from '@/components/shadcn/switch';

interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const InnerSwitch = ({ label, checked, onToggle }: Props) => {
  return (
    <div className="flex flex-row justify-between items-center py-3 border-b border-primary-3">
      <div className='text-secondary-2 text-body'>{label}</div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
};

export default InnerSwitch;
