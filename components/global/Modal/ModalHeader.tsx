"use client";

import { ReactNode } from "react";
import { Button } from "@/components/shadcn/button";
import { DialogClose, DialogTitle } from "@/components/shadcn/dialog";
import Icon from '@/components/global/Icon';
import { CloseCircle } from "iconsax-reactjs";

interface ModalHeaderProps {
    title: string;

    showCloseButton?: boolean;

    startContent?: ReactNode;

    endContent?: ReactNode;

    className?: string;
}

export default function ModalHeader({
    title,
    showCloseButton = true,
    startContent,
    endContent,
    className = "",
}: ModalHeaderProps) {
    return (
        <div
            className={`
                flex items-center justify-between
                border-b border-gray-200
                px-6 py-5
                ${className}
            `}
        >
            {/* Right */}
            <div className="flex items-center gap-3">

                {startContent}

                <DialogTitle className="text-lg font-semibold text-secondary-1">
                    {title}
                </DialogTitle>

            </div>

            {/* Left */}
            <div className="flex items-center gap-2">

                {endContent}

                {showCloseButton && (
                    <DialogClose asChild>
                        <Icon IconComponent={CloseCircle} className='text-secondary-2' variant='Linear' size={25} />
                    </DialogClose>
                )}

            </div>
        </div>
    );
}