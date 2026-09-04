'use client';

import { Label } from '@/components/shadcn/label';
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group';

interface Props {
  selected: string;
  onSelect: (value: string) => void;
  items: { id: number | string; title: string; value: string }[];
}

const InnerRadioButton = ({ selected, onSelect, items }: Props) => {
  return (
    <RadioGroup value={selected} onValueChange={onSelect} className="w-fit gap-3">
      {items.map((opt) => {
        const key = String(opt.id ?? opt.value);
        return (
          <div key={key} className="flex items-center justify-end gap-3">
            <Label htmlFor={key}>{opt.title}</Label>
            <RadioGroupItem value={key} id={key} dir="rtl" />
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default InnerRadioButton;
