"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/shadcn/button";

import ReusableModal from "@/components/global/Modal/ReusableModal";
import type { Address } from "@/components/dashboard/address/address.model";
import AddressCard from "@/components/dashboard/address/AddressCard";
import AddressModal from '@/components/dashboard/address/AddressModal';
import { StrokePrimaryButton } from '@/components/global/Buttons/StrokeAddSquareButton';


interface AddressesModalCheckoutProps {
    addresses: Address[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectable?: boolean;
    selectedAddressId?: string;
    onSelect?: (address: Address) => void;
    onDelete?: (address: Address) => Promise<void>;
    onAddressChange?: (newAddressId?: number) => void;
}

export default function AddressesModalCheckout({
    addresses,
    open,
    onOpenChange,
    selectable,
    selectedAddressId,
    onSelect,
    onDelete,
    onAddressChange,
}: AddressesModalCheckoutProps) {

      const [isAddressModalOpen, setAddressModalOpen] = useState(false);

      const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

      const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

      // track selection locally within modal before confirm
      const [localSelectedId, setLocalSelectedId] = useState<string | undefined>(selectedAddressId);

      // sync external selection when modal opens or selectedAddressId changes
      useEffect(() => {
        if (open) {
          setLocalSelectedId(selectedAddressId);
        }
      }, [open, selectedAddressId]);

    //--------------------------------------------------------

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleCreate = () => {
        setModalMode('create');
        setSelectedAddress(null);
        setAddressModalOpen(true);
    };

    //--------------------------------------------------------

    const handleSubmit = () => {
        if (localSelectedId && onSelect) {
            const addr = addresses.find(a => a.id === localSelectedId);
            if (addr) {
                onSelect(addr);
            }
        }
        handleClose();
    };

    const handleEdit = (address: Address) => {
        setModalMode('edit');
        setSelectedAddress(address);
        setAddressModalOpen(true);
    };

    const handleDelete = async (address: Address) => {
        if (onDelete) {
            await onDelete(address);
        }
    };

    const handleLocalSelect = (address: Address) => {
        setLocalSelectedId(address.id);
    };

    const handleAddressChange = (newAddressId?: number) => {
        if (newAddressId != null) setLocalSelectedId(String(newAddressId));
        onAddressChange?.(newAddressId);
    };

    //--------------------------------------------------------

    const footer = (
        <div className="flex items-center justify-between gap-3">

            <Button
                variant="outline"
                className="h-12 basis-1/3 rounded-xl"
                onClick={handleClose}
            >
                انصراف
            </Button>

            <Button
                className="h-12 basis-2/3 rounded-xl"
                onClick={handleSubmit}
                disabled={selectable && !localSelectedId}
            >
                تایید
            </Button>

        </div>
    );

    //--------------------------------------------------------

    return (
        <ReusableModal
            open={open}
            onOpenChange={onOpenChange}
            title="انتخاب آدرس"
            footer={footer}
            size="lg"
        >
            <div className="flex w-full flex-col gap-4 mb-4">

                {addresses.map((address) => (
                    <AddressCard
                        key={address.id}
                        address={address}
                        onEdit={handleEdit}
                        onDelete={handleDelete || (async () => {})}
                        selectable={selectable}
                        isSelected={localSelectedId === address.id}
                        onSelect={handleLocalSelect}
                    />
                ))}

            </div>

            <StrokePrimaryButton href='' desktopText='ثبت آدرس جدید' mobileText='ثبت آدرس جدید' className='mt-3' onClick={handleCreate} />

            <AddressModal open={isAddressModalOpen} onOpenChange={setAddressModalOpen} mode={modalMode} initialData={selectedAddress} onSuccess={handleAddressChange} />

        </ReusableModal>
    );
}
