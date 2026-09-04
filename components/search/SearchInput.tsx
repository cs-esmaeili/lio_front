"use client";

import { CloseCircle, SearchStatus } from "iconsax-reactjs";
import Icon from "@/components/global/Icon";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  dark?: boolean;
};

const SearchInput = ({ value, onChange, onClear, dark }: Props) => {
  return (
    <div className="relative w-full">
      {/* icon */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Icon
          IconComponent={SearchStatus}
          size={20}
          className={dark ? "text-white" : "text-secondary-black-3"}
        />
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="جستجو..."
        dir="rtl"
        className={`w-full h-full rounded-xl pr-12 pl-10 outline-none focus:ring-2 focus:ring-primary-3
          ${dark ? "h-12 bg-transparent text-white placeholder:text-white/40" : ""}
        `}
      />

      {value && (
        <button
          onClick={onClear}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          <Icon
            IconComponent={CloseCircle}
            className={dark ? "text-white/40" : "text-secondary-black-3"}
          />
        </button>
      )}
    </div>
  );
};

export default SearchInput;