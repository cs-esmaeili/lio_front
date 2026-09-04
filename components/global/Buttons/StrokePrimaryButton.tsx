"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface StrokePrimaryButtonProps {
  href: string;
  desktopText: string;
  mobileText: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function StrokePrimaryButton({
  href,
  desktopText,
  mobileText,
  icon,
  className = "",
  onClick,
}: StrokePrimaryButtonProps) {
  return (
    <Link href={href} className={className}>
      {/* Desktop button */}
      <button
        onClick={onClick}
        className="
          hidden w-full md:flex h-[50px] group gap-2 justify-center items-center
          bg-white text-primary-1 border border-primary-1
          py-4 px-5 rounded-[8px] select-none
          transition-all duration-1000 ease-in-out cursor-pointer
          hover:rounded-[50px] hover:bg-white hover:text-primary-1
        "
      >
        <span>{desktopText}</span>
        {icon}
      </button>

      {/* Mobile button */}
      <button
        onClick={onClick}
        className="
          flex w-full md:hidden h-[40px] group gap-2 justify-center items-center
          bg-white text-primary-1 border border-primary-1
          py-2 px-4 rounded-[8px] select-none
          transition-all duration-1000 ease-in-out cursor-pointer
          hover:rounded-[50px] hover:bg-white hover:text-primary-1
        "
      >
        <span>{mobileText}</span>
        {icon && (
          <span className="group-hover:text-primary-1 transition-all duration-1000">
            {icon}
          </span>
        )}
      </button>
    </Link>
  );
}