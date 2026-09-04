"use client";

import { ReactNode } from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcn/dialog";

import { Button } from "@/components/shadcn/button";
import Icon from '@/components/global/Icon';
import { CloseCircle } from "iconsax-reactjs";

interface ReusableModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title: string;

    children: ReactNode;

    footer?: ReactNode;

    className?: string;

    contentClassName?: string;

    showCloseButton?: boolean;

    size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
    sm: "!max-w-md",
    md: "!max-w-2xl",
    lg: "!max-w-4xl",
    xl: "!max-w-6xl",
};

export default function ReusableModal({
    open,
    onOpenChange,
    title,
    children,
    footer,
    className = "",
    contentClassName = "",
    showCloseButton = true,
    size = "md",
}: ReusableModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                dir="rtl"
                className={`
                    w-[95vw]
                    ${sizes[size]}
                    rounded-2xl
                    p-0
                    gap-0
                    overflow-hidden
                    border-0
                    shadow-xl
                    ${className}
                `}
            >
                {/* Header */}

                <DialogHeader className="border-b border-gray-200 px-6 py-5">

                    <div className="flex items-center justify-between">

                        <DialogTitle className="text-lg font-semibold text-secondary-1">
                            {title}
                        </DialogTitle>

                        {showCloseButton && (
                            <DialogClose asChild>
                                <Icon IconComponent={CloseCircle} className='text-secondary-2' variant='Linear' size={25} />
                            </DialogClose>
                        )}

                    </div>

                </DialogHeader>

                {/* Body */}

                <div
                    className={`
                        max-h-[70vh]
                        overflow-y-auto
                        px-6
                        py-6
                        ${contentClassName}
                    `}
                >
                    {children}
                </div>

                {/* Footer */}

                {footer && (
                    <div className="border-t border-gray-200 px-6 py-4">
                        {footer}
                    </div>
                )}

            </DialogContent>
        </Dialog>
    );
}