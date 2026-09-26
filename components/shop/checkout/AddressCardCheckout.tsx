"use client";

import { Location, Edit } from "iconsax-reactjs";

import type { Address } from "@/components/dashboard/address/address.model";

interface AddressCardCheckoutProps {
    change: boolean;
    address: Address;
    onEdit: (address: Address) => void;
    selectable?: boolean;
    isSelected?: boolean;
    onSelect?: (address: Address) => void;
}

export default function AddressCardCheckout({
    change,
    address,
    onEdit,
    selectable,
    isSelected,
    onSelect,
}: AddressCardCheckoutProps) {
    const card = (
        <div
            className={`flex items-start gap-1 rounded-xl border p-5 transition-colors ${
                isSelected
                    ? "border-primary-1 bg-primary-4/30"
                    : "border-gray-200"
            } ${
                selectable
                    ? "cursor-pointer hover:bg-primary-4/10"
                    : ""
            }`}
        >
            <Location
                size={20}
                variant="Bold"
                className="text-primary-1"
            />

            <div className="flex flex-1 flex-col gap-2">
                <span className="flex items-center gap-2 font-medium text-secondary-1">
                    {address.title}

                    {address.isMain && (
                        <span className="rounded-full bg-primary-3 px-2 py-0.5 text-xs text-primary-1">
                            پیش‌فرض
                        </span>
                    )}
                </span>

                <span className="text-sm text-secondary-2">
                    {address.province}، {address.city}
                </span>

                <span className="text-sm text-secondary-2">
                    {address.address}
                </span>

                <span className="text-sm text-secondary-2">
                    کد پستی: {address.postalCode}
                </span>
            </div>

            {change && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(address);
                    }}
                    className="flex flex-row items-center gap-1 rounded-lg p-1 transition-colors hover:bg-gray-100"
                >
                    <span className="hidden text-sm text-primary-1 md:block px-1">
                        ویرایش یا تغییر آدرس
                    </span>

                    <Edit
                        size={18}
                        variant="Linear"
                        className="text-secondary-2"
                    />
                </button>
            )}
        </div>
    );

    if (selectable && onSelect) {
        return (
            <div onClick={() => onSelect(address)}>
                {card}
            </div>
        );
    }

    return card;
}