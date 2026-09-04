"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

interface BorderLabelSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
  placeholder?: string;
  className?: string;
}

export function BorderLabelSelect({
  value,
  onValueChange,
  options,
  label,
  placeholder = label,
  className = "",
}: BorderLabelSelectProps) {
  return (
    <div className={`relative ${className}`}>
      <Select value={value} onValueChange={onValueChange} >
        <SelectTrigger
          className={`
            w-full h-14 rounded-lg border border-secondary-2 bg-white
            pt-5 pb-4 px-4 text-right
            focus:border-primary-1
          `}
          dir="rtl"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          dir="rtl"
          side="bottom"
          align="end"
          position="popper"
          sideOffset={4}
          avoidCollisions
          className="text-right"
        >
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-right">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Static label on the border – never moves */}
      <label
        className={`
          absolute -top-2 right-4 px-1 text-xs text-secondary-2
          bg-white pointer-events-none
        `}
      >
        {label}
      </label>
    </div>
  );
}