"use client";

import Icon from "@/components/global/Icon";
import { cn } from "@/lib/utils";
import { ArrowSquareUp } from "iconsax-reactjs";

export default function ScrollToTopButton({ className }: { className?: string }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={cn("cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1", className)}
      aria-label="بازگشت به بالای صفحه"
    >
      <Icon IconComponent={ArrowSquareUp} size={24} variant="Bold" className="text-current" />
    </button>
  );
}
