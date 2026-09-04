"use client";

import Link from "next/link";
import { ReactNode } from "react";
import Icon from '@/components/global/Icon';
import { Icon as IconType, IconProps as IconPropsType } from 'iconsax-reactjs';
import Image from 'next/image';

interface StrokePrimaryButtonProps {
    href: string;
    desktopText: string;
    mobileText: string;
    className?: string;
    onClick?: () => void;
}

export function StrokePrimaryButton({
    href,
    desktopText,
    mobileText,
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
          py-2 px-4 rounded-xl select-none
          transition-all duration-1000 ease-in-out cursor-pointer
          hover:rounded-[50px] hover:bg-white hover:text-primary-1
        "
            >

                <div className="w-6 h-6 relative bottom-px">
                    <Image
                        src="/icons/add-square.svg"
                        alt="No addresses"
                        fill
                        className="object-contain"
                        sizes="80px"
                    />
                </div>
                <span className="text-regular">{desktopText}</span>
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
                <div className="w-5 h-5 relative bottom-px">
                    <Image
                        src="/icons/add-square.svg"
                        alt="No addresses"
                        fill
                        className="object-contain"
                        sizes="80px"
                    />
                </div>
                <h6>{mobileText}</h6>
            </button>
        </Link>
    );
}