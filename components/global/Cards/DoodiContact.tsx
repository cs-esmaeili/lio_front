import Icon from '@/components/global/Icon';
import { Mobile } from 'iconsax-reactjs';

const DoodiContact = ({ callToAction }: { callToAction?: string }) => {
  return (
    <div className={`p-4 flex flex-col gap-4 bg-linear-to-r from-primary-3 to-primary-1 rounded-[20px]`}>
      <a href={`tel:${callToAction}`}>
      <div className='flex gap-2'>     
        <div className='w-14 h-14 bg-gray-1 flex justify-center items-center rounded-full'>
          <Icon IconComponent={Mobile} size={32} className='text-primary-1 group-hover:text-white transition-colors duration-300 ' variant='Bold' />
        </div>
        <div className='flex-1 not-only:flex flex-row justify-between items-center gap-7.25'>
          <h6 className='text-secondary-black-3'>ارتباط با دودیگرام</h6>
          <h5 className='text-secondary-black-3'>{`${callToAction}`}</h5>
        </div>      
      </div>
      </a>
    </div>
  );
};

export default DoodiContact;
