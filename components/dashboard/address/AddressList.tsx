'use client';

import AddressCard from '@/components/dashboard/address/AddressCard';

import type { Address } from '@/components/dashboard/address/address.model';

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => Promise<void>;
}

export default function AddressList({ addresses, onEdit, onDelete }: AddressListProps) {


  return (
    <div className='flex w-full flex-col gap-4'>
      {addresses.map((address) => (
        <AddressCard key={address.id} address={address} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
