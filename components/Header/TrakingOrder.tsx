import Link from 'next/link';
import { Headphone } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';

export default function TrakingOrder({
  footerData,
}: {
  footerData: any;
}) {

    return (
        <Link
        href={`tel:${footerData?.support_phone || footerData?.telephone || ''}`}
        prefetch={false}
        className='flex md:hidden items-center justify-center rounded-lg bg-primary-3 w-9 h-9 relative cursor-pointer hover:bg-primary-3/80 transition-colors hover:rounded-full'>
        <Icon IconComponent={Headphone} className='text-secondary-black-3' size={24} aria-hidden='true' variant='TwoTone' toneTwoColor='--color-primary-1' />
        </Link>
    );
}
