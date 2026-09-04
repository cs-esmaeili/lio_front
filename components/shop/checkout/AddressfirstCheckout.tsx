"use client";

import AddressCardCheckout from '@/components/shop/checkout/AddressCardCheckout';
import type { Address } from "@/components/dashboard/address/address.model";
import { ArrowLeft2 } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';

interface AddressfirstProps {
    change: boolean;
    addresses: Address[];
    onEdit: (address: Address) => void;
    selectable?: boolean;
    selectedAddressId?: string;
    onSelect?: (address: Address) => void;
    onShowAll?: () => void;
}

export default function Addressfirst({
    change,
    addresses,
    onEdit,
    selectable,
    selectedAddressId,
    onSelect,
    onShowAll,
}: AddressfirstProps) {

    const selectedAddress = selectedAddressId
        ? addresses.find(a => a.id === selectedAddressId)
        : addresses[0];

    const displayAddress = selectedAddress ?? addresses[0];

    return (
        <div className="flex w-full flex-col gap-4">
            {displayAddress && (
                <AddressCardCheckout
                    change={change}
                    key={displayAddress.id}
                    address={displayAddress}
                    onEdit={onEdit}
                    selectable={selectable}
                    isSelected={selectedAddressId === displayAddress.id}
                    onSelect={onSelect}
                />
            )}

            {onShowAll && addresses.length > 0 && (
                <button
                    type="button"
                    onClick={onShowAll}
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-gray-300 p-3 text-sm text-secondary-2 hover:border-primary-1 hover:text-primary-1 transition-colors"
                >
                    <span>مشاهده همه آدرس‌ها</span>
                    <span className="bg-gray-100 rounded-full px-2 py-0.5 text-xs text-secondary-2">
                        {addresses.length} آدرس
                    </span>
                    <Icon
                        IconComponent={ArrowLeft2}
                        className="text-secondary-2"
                        size={16}
                        variant="Linear"
                    />
                </button>
            )}
        </div>
    );
}
