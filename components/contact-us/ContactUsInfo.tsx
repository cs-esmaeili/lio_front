import Image from 'next/image';

interface ContactUsInfoProps {
  address?: string;
  addressTehran?: string;
  supportPhone?: string;
  telephone?: string;
  internalSupport?: string;
  internalConsulting?: string;
}

const splitPhoneNumber = (phone: string) => {
  if (!phone) return { code: '', number: '' };
  
  if (phone.includes('-')) {
    const parts = phone.split('-');
    return { 
      code: parts[0],     
      number: parts[1]    
    };
  }
  
  return { code: '', number: phone };
};

export default function ContactUsInfo({
  address,
  addressTehran,
  supportPhone,
  telephone,
  internalSupport,
  internalConsulting
}: ContactUsInfoProps) {

  const tele_phone = splitPhoneNumber(telephone || '');
  const support_phone = splitPhoneNumber(supportPhone || '');


  return (
    <div className='h-full rounded-[20px] bg-secondary-black-3 p-8 shadow-[20px_20px_40px_rgb(6,6,7,0.1)]'>
      <div className='text-white'>
        <h4 className='text-gray-1'>اطلاعات تماس</h4>
        <h6 className='text-secondary-3 mt-4'> دفتر اصفهان:</h6>
        <h6 className='text-gray-1 mt-1'>{address || 'آدرس در دسترس نیست'}</h6>
      </div>
      <div className='divider bg-primary-1 my-4 w-full h-px'></div>
      <div>
        <h6 className='text-secondary-3 mt-4'> دفتر تهران:</h6>
        <h6 className='text-gray-1 mt-1'>{addressTehran || 'آدرس در دسترس نیست'}</h6>
      </div>
      <div className='divider bg-primary-1 my-4 w-full h-px'></div>
      <div className='phone-box '>
        <div className='bg-primary-3 min-h-17 rounded-2xl flex item-center justify-center md:gap-5 lg:gap-8 px-2 lg:p-4'>
          <Image 
            width={32} 
            height={32} 
            src='/contact-us/call-calling.svg' 
            alt='call' 
            className='h-8 w-8 my-auto' 
          />
          <div className='flex items-center justify-center flex-wrap gap-x-2 md:gap-x-4 lg:gap-x-2 w-full sm:w-auto'>
            <a href={`tel:${telephone?.replace(/-/g, '') || ''}`} className='phon1 flex items-center justify-center gap-2'>
              <h4 className='text-secondary-1 '>{tele_phone.number || 'شماره در دسترس نیست'}</h4>
              <h6 className='text-secondary-black-1'>{tele_phone.code}</h6>
            </a>
            <a href={`tel:${supportPhone?.replace(/-/g, '') || ''}`} className='phon2 flex items-center justify-center gap-2'>
              <h4 className='text-secondary-1 '>{support_phone.number || 'شماره در دسترس نیست'}</h4>
              <h6 className='text-secondary-black-1'>{support_phone.code}</h6>
            </a>
          </div>
        </div>
        <div className='internal-phones flex justify-start gap-11 items-center mt-4'>
          <div className='flex flex-col justify-start items-start'>
            <div className='w-8 h-8 rounded-full flex items-center justify-center text-[1.2rem] bg-primary'>1</div>
            <div className='flex items-center justify-start mt-2 flex-wrap gap-1'>
              <h6 className='text-gray-1 text-nowrap'>مشاوره پیش از خرید:</h6>
              <h6 className='text-secondary-3 text-nowrap'>{internalConsulting || 'داخلی یک'}</h6>
            </div>
          </div>
          <div className='flex flex-col justify-start items-start'>
            <div className='w-8 h-8 rounded-full flex items-center justify-center text-[1.2rem] bg-primary'>2</div>
            <div className='flex items-center justify-start mt-2 flex-wrap gap-1'>
              <h6 className='text-gray-1'>واحد پشتیبانی:</h6>
              <h6 className='text-secondary-3'>{internalSupport || 'داخلی دو'}</h6>
            </div>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
