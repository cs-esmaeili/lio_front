import { ArrowLeft } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';
import Link from 'next/link';

const MoreButton = ({ link, light = false }: { link: string; light?: boolean }) => {
  const variant = light
    ? 'bg-primary-4 text-primary-1 hover:bg-primary-3'
    : 'bg-primary-1 text-custom-white hover:bg-primary-2';

  return (
    <Link
      href={link}
      className={`flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors ${variant}`}>
      <span className='hidden md:inline'>مشاهده بیشتر</span>
      <span className='md:hidden'>همه</span>
      <Icon IconComponent={ArrowLeft} size={18} variant='TwoTone' className='text-current' />
    </Link>
  );
};

export default MoreButton;
