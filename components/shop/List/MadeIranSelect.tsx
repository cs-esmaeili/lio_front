"use client";

import { Label } from "@/components/shadcn/label";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";

interface Props {
  value: string | null;
  onValueChange: (value: string | null) => void;
}

const OPTIONS = [
  { label: "همه", value: "all" },
  { label: "ایرانی", value: "1" },
  { label: "خارجی", value: "0" },
] as const;

export default function MadeIranSelect({ value, onValueChange }: Props) {
  const currentValue = value ?? "all";

  return (
    <RadioGroup
      value={currentValue}
      onValueChange={(val) => {
        onValueChange(val === "all" ? null : val);
      }}
      className="w-fit gap-3"
    >
      {OPTIONS.map((opt) => (
        <div key={opt.value} className="flex items-center justify-end gap-3">
          <Label htmlFor={`made-iran-${opt.value}`}>{opt.label}</Label>
          <RadioGroupItem value={opt.value} id={`made-iran-${opt.value}`} dir="rtl" />
        </div>
      ))}
    </RadioGroup>
  );
}
