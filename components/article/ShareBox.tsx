import Image from 'next/image';
import linkedin from '@/public/icons/linkedin.svg';
import telegram2 from '@/public/icons/telegram2.svg';
import whtsapp from '@/public/icons/whtsapp.svg';

type Props = {
  url: string;
  title: string;
};

const ShareBox = ({ url, title }: Props) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);

  const links = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  };

  return (
    <div className='flex items-center gap-1 p-3 w-fit'>
      <a href={links.linkedin} target='_blank' rel='noopener noreferrer'>
        <Image src={linkedin} width={24} height={24} alt='linkedin' />
      </a>

      <a href={links.telegram} target='_blank' rel='noopener noreferrer'>
        <Image src={telegram2} width={24} height={24} alt='telegram' />
      </a>

      <a href={links.whatsapp} target='_blank' rel='noopener noreferrer'>
        <Image src={whtsapp} width={24} height={24} alt='whatsapp' />
      </a>
    </div>
  );
};

export default ShareBox;
