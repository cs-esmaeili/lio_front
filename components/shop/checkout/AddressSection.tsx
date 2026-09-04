"use client";

import { useEffect, useState } from 'react';

import AddressModal from '@/components/dashboard/address/AddressModal';
import AddressModalCheckout from '@/components/shop/checkout/AddressModalCheckout';
import AddressfirstCheckout from '@/components/shop/checkout/AddressfirstCheckout';
import type { Address } from '@/components/dashboard/address/address.model';
import { StrokePrimaryButton } from '@/components/global/Buttons/StrokeAddSquareButton';
import { Spinner } from '@/components/shadcn/spinner';

import { useAddressList } from '@/hooks/address/useAddressList';
import { useRemoveAddress } from '@/hooks/address/useRemoveAddress';

interface AddressSectionProps {
  onAddressesChange?: (addresses: Address[]) => void;
  onSelectionChange?: (selectedAddressId: string | undefined) => void;
  /** When set, opens the AddressModal in edit mode for the address with this ID.
   *  Used to react to /payment errors like missing name_family. */
  editAddressId?: string;
  /** Called after the edit modal opens, so parent can clear the trigger. */
  onEditAddressHandled?: () => void;
  /** Called after address modal saves successfully, so parent can re-fetch payment data. */
  onAddressSaved?: () => void;
}

export default function AddressSection({
  onAddressesChange,
  onSelectionChange,
  editAddressId,
  onEditAddressHandled,
  onAddressSaved,
}: AddressSectionProps) {
  // ---- data ----

  const { addresses, loading: addressesLoading, refetch: refetchAddresses } = useAddressList();
  const { removeAddress } = useRemoveAddress();

  // ---- modal state ----

  const [isAddressesModalOpen, setAddressesModalOpen] = useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();

  // ---- initial selection ----

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // ---- sync to parent ----

  useEffect(() => {
    onAddressesChange?.(addresses);
  }, [addresses, onAddressesChange]);

  useEffect(() => {
    onSelectionChange?.(selectedAddressId);
  }, [selectedAddressId, onSelectionChange]);

  // ---- trigger edit from external signal (e.g. /payment name_family error) ----

  useEffect(() => {
    if (!editAddressId) return;
    const addr = addresses.find((a) => a.id === editAddressId);
    if (addr) {
      handleEdit(addr);
      onEditAddressHandled?.();
    }
    // only fire when editAddressId changes, not when addresses list changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAddressId]);

  // ---- handlers ----

  const handleShowAllAddresses = () => {
    setAddressesModalOpen(true);
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedAddress(null);
    setAddressModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setModalMode('edit');
    setSelectedAddress(address);
    setAddressModalOpen(true);
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address.id);
  };

  const handleDeleteAddress = async (address: Address) => {
    const id = Number(address.id);
    if (!Number.isFinite(id) || id <= 0) return;

    const result = await removeAddress(id);
    if (result) {
      if (selectedAddressId === address.id) {
        setSelectedAddressId(undefined);
      }
      refetchAddresses();
    }
  };

  const handleAddressModalSuccess = async (newAddressId?: number) => {
    const rawList = await refetchAddresses();
    if (newAddressId != null) {
      setSelectedAddressId(String(newAddressId));
    } else if (rawList && rawList.length > 0) {
      // Auto-select first address after create/edit when none is selected
      setSelectedAddressId((prev) => prev ?? String(rawList[0].id));
    }
    onAddressSaved?.();
  };

  // ---- render ----

  return (
    <>
      <span className='block border-b border-primary-3 my-5 pb-2 text-body'>انتخاب آدرس</span>

      {addressesLoading && (
        <div className='flex items-center justify-center py-10'>
          <Spinner className='size-8' />
        </div>
      )}

      {!addressesLoading && addresses.length === 0 && (
        <div className='flex flex-1 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-primary-1 p-5 text-center'>
          <h6 className='text-gray-3'>لیست آدرس‌های شما خالی است</h6>
          <StrokePrimaryButton href='' desktopText='ثبت آدرس' mobileText='ثبت آدرس' className='mt-3' onClick={handleCreate} />
        </div>
      )}

      {addresses.length > 0 && (
        <AddressfirstCheckout
          change={true}
          addresses={addresses}
          onEdit={handleEdit}
          selectable={true}
          selectedAddressId={selectedAddressId}
          onSelect={handleSelectAddress}
          onShowAll={handleShowAllAddresses}
        />
      )}

      <AddressModalCheckout
        addresses={addresses}
        open={isAddressesModalOpen}
        onOpenChange={setAddressesModalOpen}
        selectable={true}
        selectedAddressId={selectedAddressId}
        onSelect={handleSelectAddress}
        onDelete={handleDeleteAddress}
        onAddressChange={handleAddressModalSuccess}
      />

      <AddressModal
        open={isAddressModalOpen}
        onOpenChange={setAddressModalOpen}
        mode={modalMode}
        initialData={selectedAddress}
        onSuccess={handleAddressModalSuccess}
      />
    </>
  );
}
