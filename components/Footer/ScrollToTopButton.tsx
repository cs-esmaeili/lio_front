"use client";

import Icon from "@/components/global/Icon";
import { ArrowSquareUp } from "iconsax-reactjs";

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="cursor-pointer transition-opacity hover:opacity-80 focus:outline-none"
      aria-label="بازگشت به بالای صفحه"
    >
      <Icon IconComponent={ArrowSquareUp} size={32} variant="Bold" />
    </button>
  );
}