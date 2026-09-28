'use client';

import { Edit } from 'iconsax-reactjs';

import PageHeader from '@/components/dashboard/PageHeader';
import Icon from '@/components/global/Icon';
import ProfileEditForm from '@/components/profile/ProfileEditForm';

export default function EditProfilePage() {
  return (
    <div className='flex h-full w-full flex-col gap-4 overflow-x-hidden'>
      <div className='flex w-full flex-col gap-6 rounded-xl border-2 border-gray-1 px-6 py-6 sm:px-4'>
        <PageHeader
          titleSlot={
            <div className='inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1'>
              <Icon
                IconComponent={Edit}
                className='text-secondary-black-3'
                size={24}
                aria-hidden='true'
                variant='TwoTone'
                toneTwoColor='--color-primary-1'
              />
              <span className='text-regular text-secondary-1'>ویرایش اطلاعات کاربری</span>
            </div>
          }
        />

        <ProfileEditForm />
      </div>
    </div>
  );
}
