"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Spinner } from "@/components/shadcn/spinner";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md";      // small (cart) or medium (default)
  className?: string;
  onRemove?: () => void;    // when set + value <= min → show trash icon, call on click
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = Infinity,
  disabled = false,
  loading = false,
  size = "sm",
  className = "",
  onRemove,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (disabled) return;
    const newVal = Math.max(min, value - 1);
    if (newVal !== value) onChange(newVal);
  };

  const handleIncrease = () => {
    if (disabled) return;
    const newVal = Math.min(max, value + 1);
    if (newVal !== value) onChange(newVal);
  };

  // Size variants – matches your cart style for 'sm'
  const sizeClasses = {
    sm: {
      container: "gap-2 border rounded-lg px-3 py-2",
      button: "text-gray-500 hover:text-gray-700 disabled:opacity-50",
      icon: "text-primary-1 size-3.5",   // ~14px
      value: "w-6 text-center text-sm",
    },
    md: {
      container: "border rounded-xl overflow-hidden",
      button: "w-10 h-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50",
      icon: "text-primary-1 size-4",     // 16px
      value: "w-10 text-center text-sm",
    },
  };

  const styles = sizeClasses[size];

  return (
    <div className={`flex items-center ${styles.container} ${className}`}>
      {onRemove && value <= min ? (
        <button onClick={onRemove} className={styles.button} type="button">
          <Trash2 className={styles.icon} />
        </button>
      ) : (
        <button
          onClick={handleDecrease}
          disabled={disabled || value <= min}
          className={styles.button}
          type="button"
        >
          <Minus className={styles.icon} />
        </button>
      )}

      {loading ? (
        <Spinner className={`${styles.icon} animate-spin`} />
      ) : (
        <span className={styles.value}>{value}</span>
      )}

      <button
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className={styles.button}
        type="button"
      >
        <Plus className={styles.icon} />
      </button>
    </div>
  );
}