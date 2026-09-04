'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface SolidPrimaryButtonProps {
  href: string;
  desktopText: string;
  mobileText: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void; // optional click handler
}

export function SolidPrimaryButton({
  href,
  desktopText,
  mobileText,
  icon,
  className = '',
  onClick, // destructure onClick
}: SolidPrimaryButtonProps) {
  return (
    <Link href={href} className={className}>
      {/* Desktop button */}
      <button
        onClick={onClick} // attach handler
        className='hidden w-full md:flex h-[50px] group gap-2 justify-center items-center bg-primary-1 text-primary-4 py-4 px-5 rounded-[8px] select-none
          hover:rounded-[50px] hover:bg-primary-1 transition-all duration-1000 ease-in-out cursor-pointer'>
        <span>{desktopText}</span>
        {icon}
      </button>

      {/* Mobile button */}
      <button
        onClick={onClick} // attach handler
        className='flex w-full md:hidden h-[40px] group gap-2 justify-center items-center py-2 px-4 rounded-[8px] select-none bg-primary-1 text-primary-4
          hover:rounded-[50px] hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer'>
        <span>{mobileText}</span>
        {icon && <span className='group-hover:text-secondary-black-3 transition-all duration-1000'>{icon}</span>}
      </button>
    </Link>
  );
}
