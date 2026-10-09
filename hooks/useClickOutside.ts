"use client";

import { useEffect } from "react";

export const useClickOutside = (
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  extraRef?: React.RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (ref.current?.contains(target)) return;
      if (extraRef?.current?.contains(target)) return;

      handler();
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, extraRef, handler]);
};
