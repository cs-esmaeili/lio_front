import ContactUsClock from '@/components/contact-us/ContactUsClock';

interface ContactUsCtaProps {
  timeWork?: string;
}

export default function ContactUsCta({ 
  timeWork 
}: ContactUsCtaProps) {
  return (
    <div className='times-conatiner flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 p-4 lg:px-8 border border-primary-3 h-full rounded-2xl'>
      <ContactUsClock />
      <div className='info flex flex-col lg:flex-row items-center justify-center lg:gap-8'>
        <h5 className='text-xs text-wordpress-black-3'>ساعت کار پشتیبانی</h5>
        <div className='divider bg-primary-1 w-full lg:h-8 lg:w-px shrink-0'></div>
        <h5 className='text-wordpress-black-3 text-xs'>{timeWork}</h5>
      </div>
    </div>
  );
}