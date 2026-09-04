'use client';

import { useState } from 'react';

import Image from 'next/image';
import { Location } from 'iconsax-reactjs';

import PageHeader from '@/components/dashboard/PageHeader';
import GhostCloseButton from '@/components/global/Buttons/GhostCloseButton';
import { StrokePrimaryButton } from '@/components/global/Buttons/StrokeAddSquareButton';
import Icon from '@/components/global/Icon';

import AddressModal from '@/components/dashboard/address/AddressModal';
import AddressList from '@/components/dashboard/address/AddressList';
import { Spinner } from '@/components/shadcn/spinner';

import type { Address } from '@/components/dashboard/address/address.model';

import { useAddressList } from '@/hooks/address/useAddressList';
import { useRemoveAddress } from '@/hooks/address/useRemoveAddress';

export default function AddressPage() {
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const { addresses, loading, refetch } = useAddressList();
  const { removeAddress } = useRemoveAddress();

  //----------------------------------------------------

  const pageInfo = {
    href: '/dashboard/address',
    label: 'آدرس‌ها',
    icon: Location,
  };

  //----------------------------------------------------

  const handleCreate = () => {
    setModalMode('create');
    setSelectedAddress(null);
    setAddressModalOpen(true);
  };

  //----------------------------------------------------

  const handleEdit = (address: Address) => {
    setModalMode('edit');
    setSelectedAddress(address);
    setAddressModalOpen(true);
  };

  //----------------------------------------------------

  const handleDelete = async (address: Address) => {
    const id = Number(address.id);
    if (!Number.isFinite(id) || id <= 0) return;

    const result = await removeAddress(id);
    if (result) refetch();
  };

  //----------------------------------------------------

  return (
    <>
      <div className='flex h-full flex-col items-start gap-6 rounded-2xl border-2 border-gray-1 p-4'>
        <PageHeader
          titleSlot={
            <div className='inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1'>
              <Icon IconComponent={pageInfo.icon} className='text-secondary-black-3' size={24} variant='TwoTone' toneTwoColor='--color-primary-1' />

              <h6 className='text-regular text-secondary-1'>{pageInfo.label}</h6>
            </div>
          }
          actionsSlot={
            addresses.length !== 0 && (
              <div className='inline-flex items-center gap-4 cursor-pointer'>
                <GhostCloseButton iconPath='/icons/add-square.svg' className='bg-transparent hover:bg-primary-2/50' onClick={handleCreate}>
                  افزودن آدرس جدید
                </GhostCloseButton>
              </div>
            )
          }
        />

        {/* Loading */}
        {loading && (
          <div className='flex flex-1 w-full items-center justify-center p-20'>
            <Spinner className='size-8 text-primary-1' />
          </div>
        )}

        {/* Empty State */}
        {!loading && addresses.length === 0 && (
          <div className='flex flex-1 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-primary-1 p-20 text-center'>
            <div className='relative mb-4 h-20 w-20'>
              <Image src='/icons/empty-data.svg' alt='No Address' fill className='object-contain' />
            </div>

            <h6 className='text-gray-3'>لیست آدرس‌های شما خالی است</h6>

            <StrokePrimaryButton href='' desktopText='ثبت آدرس' mobileText='ثبت آدرس' className='mt-3' onClick={handleCreate} />
          </div>
        )}

        {/* Address List */}
        {!loading && addresses.length > 0 && (
          <AddressList addresses={addresses} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      <AddressModal
        open={isAddressModalOpen}
        onOpenChange={setAddressModalOpen}
        mode={modalMode}
        initialData={selectedAddress}
        onSuccess={() => {
          refetch();
        }}
      />
    </>
  );
}
