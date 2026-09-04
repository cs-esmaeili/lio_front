import Image from 'next/image';

interface SocialMediaItem {
  title: string;
  image: string;
  key: string;
  value: string;
  full_url: string;
}

interface ContactUsSocialMediaProps {
  communications?: SocialMediaItem[];
}

export default function ContactUsSocialMedia({ 
  communications = [] 
}: ContactUsSocialMediaProps) {
  
  // اگر داده‌ای وجود نداشت، پیام نمایش داده شود
  if (!communications || communications.length === 0) {
    return (
      <div className='social-media-container grid grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-8 gap-y-5 max-lg:flex max-lg:justify-center'>
        <div className='col-span-full text-center text-gray-500 py-8'>
          شبکه‌های اجتماعی در دسترس نیست
        </div>
      </div>
    );
  }


  // تابع برای تبدیل کلید به عنوان نمایشی
  const getSocialTitle = (key: string) => {
    const titles: { [key: string]: string } = {
      'telegram': 'تلگرام',
      'whatsapp': 'واتساپ',
      'instagram': 'اینستاگرام',
      'twitter': 'توییتر',
      'linkedin': 'لینکدین',
      'youtube': 'یوتیوب',
      'aparat': 'آپارات',
      'github': 'گیت‌هاب'
    };
    return titles[key] || key;
  };

  return (
    <div className='social-media-container grid grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-8 gap-y-5 max-lg:flex max-lg:justify-center'>
      {communications.map((social, index) => (
        <a
          key={index}
          href={social.full_url || '#'}
          target='_blank'
          rel='noopener noreferrer'
          className='social-box border border-primary-3 rounded-[15px] h-16 flex items-center justify-center gap-2 py-4 px-6 hover:bg-gray-50 transition'
        >
          {social.image && (
            <Image 
              height={40} 
              width={40} 
              src={social.image} 
              alt={social.key || 'social'} 
              className='w-10 h-10 object-contain'
            />
          )}
          <span className='text-lg text-secondary-2'>
            {social.title || getSocialTitle(social.key)}
          </span>
        </a>
      ))}
    </div>
  );
}