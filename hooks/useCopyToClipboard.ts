"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseCopyToClipboardOptions {
  /** Toast message shown on success */
  successMessage?: string;
  /** Toast message shown on error */
  errorMessage?: string;
  /** Duration in ms before resetting copied state (default 2000) */
  resetDuration?: number;
}

interface UseCopyToClipboardReturn {
  /** Whether a copy just completed — useful for showing checkmark icon */
  copied: boolean;
  /** Copy the given text to clipboard. Also resets `copied` after resetDuration */
  copy: (text: string) => Promise<void>;
  /** Manually reset the copied state */
  reset: () => void;
}

export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
  const {
    successMessage = "کپی شد",
    errorMessage = "خطا در کپی",
    resetDuration = 2000,
  } = options;

  const [copied, setCopied] = useState(false);

  const reset = useCallback(() => setCopied(false), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(successMessage);
        setTimeout(reset, resetDuration);
      } catch {
        toast.error(errorMessage);
      }
    },
    [successMessage, errorMessage, resetDuration, reset]
  );

  return { copied, copy, reset };
}
