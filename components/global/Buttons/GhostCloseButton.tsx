import { Button } from "@/components/shadcn/button";
import { ReactNode } from "react";
import Image from 'next/image';

interface GhostButtonProps {
  children: ReactNode;
  iconPath: string,
  iconPosition?: "start" | "end";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function GhostCloseButton({
  children,
  iconPath,
  iconPosition = "start",
  onClick,
  className = "",
  disabled = false,
}: GhostButtonProps) {
  const iconElement = (
    <div className="w-6 h-6 relative shrink-0">
      <Image
        src={iconPath}
        alt="Close"
        fill
        className="object-contain"
      />
    </div>
  );

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`gap-2 text-primary-1 inline-flex items-center h-auto px-2 py-2 
        hover:bg-transparent hover:text-primary-1 hover:rounded-[50px] 
        transition-all duration-1000 ease-in-out focus-visible:ring-0 ${className}`}
    >
      {iconPosition === "start" && iconElement}
      {children}
      {iconPosition === "end" && iconElement}
    </Button>
  );
}