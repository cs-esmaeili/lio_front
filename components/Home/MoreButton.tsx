import { ArrowLeft } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';
import Link from 'next/link';

const MoreButton = ({ link, light = false }: { link: string; light?: boolean }) => {
  if (light) {
    return (
      <Link href={link}>
        <button
          className='hidden md:flex h-12.5 group gap-2 justify-center items-center py-2 px-4 rounded-[8px] select-none bg-primary-4 text-primary-1
                         hover:rounded-[50px] hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer'>
          <span>مشاهده بیشتر</span>
          <Icon
            IconComponent={ArrowLeft}
            size={24}
            variant='TwoTone'
            className='group-hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer'
          />
        </button>
        <button
          className='flex md:hidden h-10 group gap-2 justify-center items-center py-2 px-4 rounded-[8px] select-none bg-primary-4 text-primary-1
                          hover:rounded-[50px] hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer '>
          <span>همه</span>
          <Icon
            IconComponent={ArrowLeft}
            size={24}
            variant='TwoTone'
            className='group-hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer'
          />
        </button>
      </Link>
    );
  }
  return (
    <Link href={link}>
      <button
        className='hidden md:flex h-12.5 group gap-2 justify-center items-center bg-primary-3/50 py-2 px-4 rounded-[8px] select-none
            hover:rounded-[50px] hover:bg-primary-3 transition-all duration-1000 ease-in-out cursor-pointer text-primary-1'>
        <span>مشاهده بیشتر</span>
        <Icon
          IconComponent={ArrowLeft}
          size={24}
          variant='TwoTone'
          toneTwoColor='--color-primary-1'
          className='text-secondary-black-1  hidden md:block'
        />
      </button>
      <button
        className='flex md:hidden h-10 group gap-2 justify-center items-center py-2 px-4 rounded-[8px] select-none bg-primary-4 text-primary-1
          hover:rounded-[50px] hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer '>
        <span>همه</span>
        <Icon
          IconComponent={ArrowLeft}
          size={24}
          variant='TwoTone'
          toneTwoColor='--color-primary-1'
          className='group-hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer text-secondary-black-1 hidden md:block'
        />
      </button>
    </Link>
  );
};

export default MoreButton;
