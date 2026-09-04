'use client';

import { Checkbox } from '@/components/shadcn/checkbox';
import { Field, FieldLabel } from '@/components/shadcn/field';

interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
  id?: string;
}

const InnerCheckBox = ({ label, checked, onToggle, id }: Props) => {
  const checkboxId = id ?? `cb-${label}`;

  return (
    <Field orientation="horizontal" className="cursor-pointer">
      <Checkbox
        id={checkboxId}
        checked={checked}
        onCheckedChange={onToggle}
        className="cursor-pointer"
      />
      <FieldLabel className="cursor-pointer" htmlFor={checkboxId}>
        {label}
      </FieldLabel>
    </Field>
  );
};

export default InnerCheckBox;
