import Image from 'next/image';

interface ContactUsInfoProps {
  address?: string;
  email?: string;
  supportPhone?: string;
}

const splitPhoneNumber = (phone: string) => {
  if (!phone) return { code: '', number: '' };

  if (phone.includes('-')) {
    const parts = phone.split('-');
    return {
      code: parts[0],
      number: parts[1],
    };
  }

  return { code: '', number: phone };
};

export default function ContactUsInfo({ address, email, supportPhone }: ContactUsInfoProps) {
  const support_phone = splitPhoneNumber(supportPhone || '');

  return (
    <div className='h-full rounded-[20px] bg-secondary-black-3 p-8 shadow-[20px_20px_40px_rgb(6,6,7,0.1)]'>
      <div className='text-white'>
        <h4 className='text-gray-1'>اطلاعات تماس</h4>
        <h6 className='text-secondary-3 mt-4'>آدرس:</h6>
        <h6 className='text-gray-1 mt-1'>{address || 'آدرس در دسترس نیست'}</h6>
      </div>

      <div className='divider bg-primary-1 my-4 w-full h-px'></div>

      <div>
        <h6 className='text-secondary-3'>ایمیل:</h6>
        <a href={`mailto:${email || ''}`} className='text-gray-1 mt-1 inline-block' dir='ltr'>
          {email || 'ایمیل در دسترس نیست'}
        </a>
      </div>

      <div className='divider bg-primary-1 my-4 w-full h-px'></div>

      <div className='phone-box'>
        <div className='bg-primary-3 min-h-17 rounded-2xl flex items-center justify-center md:gap-5 lg:gap-8 px-2 lg:p-4'>
          <Image width={32} height={32} src='/contact-us/call-calling.svg' alt='call' className='h-8 w-8 my-auto' />
          <a href={`tel:${supportPhone?.replace(/-/g, '') || ''}`} className='flex items-center justify-center gap-2'>
            <h4 className='text-secondary-1'>{support_phone.number || 'شماره در دسترس نیست'}</h4>
            <h6 className='text-secondary-black-1'>{support_phone.code}</h6>
          </a>
        </div>
      </div>
    </div>
  );
}
