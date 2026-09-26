'use client';

import { useState } from 'react';

import AddressModal from '@/components/dashboard/address/AddressModal';
import AddressModalCheckout from '@/components/shop/checkout/AddressModalCheckout';
import AddressfirstCheckout from '@/components/shop/checkout/AddressfirstCheckout';
import type { Address } from '@/components/dashboard/address/address.model';
import { StrokePrimaryButton } from '@/components/global/Buttons/StrokeAddSquareButton';

import { useRemoveAddress } from '@/hooks/address/useRemoveAddress';

/**
 * Controlled address picker. The address list comes from `GET /checkout`
 * (through the store); create/edit/delete still talk to the address API and
 * then ask the parent to refresh the checkout payload.
 */
export default function AddressSection({
  addresses,
  selectedAddressId,
  onSelect,
  onAddressesChanged,
}: {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelect: (id: string) => void;
  onAddressesChanged: () => void;
}) {
  const { removeAddress } = useRemoveAddress();

  const [isAddressesModalOpen, setAddressesModalOpen] = useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

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

  const handleSelect = (address: Address) => {
    onSelect(address.id);
  };

  const handleDelete = async (address: Address) => {
    const id = Number(address.id);
    if (!Number.isFinite(id) || id <= 0) return;

    const result = await removeAddress(id);
    if (result) onAddressesChanged();
  };

  const handleSaved = (newAddressId?: number) => {
    onAddressesChanged();
    if (newAddressId != null) onSelect(String(newAddressId));
  };

  return (
    <>
      <span className='block border-b border-primary-3 my-5 pb-2 text-body'>انتخاب آدرس</span>

      {addresses.length === 0 ? (
        <div className='flex flex-1 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-primary-1 p-5 text-center'>
          <h6 className='text-gray-3'>لیست آدرس‌های شما خالی است</h6>
          <StrokePrimaryButton href='' desktopText='ثبت آدرس' mobileText='ثبت آدرس' className='mt-3' onClick={handleCreate} />
        </div>
      ) : (
        <AddressfirstCheckout
          change
          addresses={addresses}
          onEdit={handleEdit}
          selectable
          selectedAddressId={selectedAddressId ?? undefined}
          onSelect={handleSelect}
          onShowAll={() => setAddressesModalOpen(true)}
        />
      )}

      <AddressModalCheckout
        addresses={addresses}
        open={isAddressesModalOpen}
        onOpenChange={setAddressesModalOpen}
        selectable
        selectedAddressId={selectedAddressId ?? undefined}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onAddressChange={handleSaved}
      />

      <AddressModal
        open={isAddressModalOpen}
        onOpenChange={setAddressModalOpen}
        mode={modalMode}
        initialData={selectedAddress}
        onSuccess={handleSaved}
      />
    </>
  );
}
