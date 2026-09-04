"use client";

import type { ReactNode } from "react";


interface OrderInfoProps {
    title: string;

    value: ReactNode;
}


export default function OrderInfo({
    title,
    value,
}: OrderInfoProps) {
    return (
        <div className="flex flex-row gap-1">
            <span className="text-sm text-gray-400">
                {title}
            </span>

            <div className="text-secondary-1">
                {value}
            </div>
        </div>
    );
}
