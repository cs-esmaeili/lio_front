import Image from 'next/image';
import telegram from '@/public/icons/telegram.svg';
import rubika from '@/public/icons/rubika.svg';

type Communication = {
  key: string;
  full_url: string;
};

export default function CallSocial({ communications }: { communications: Communication[] }) {
  return (
    <div className="flex items-center gap-4">
      {communications.map((comm) => {
        if (comm.key === 'telegram') {
          return (
            <a
              key={comm.key}
              href={comm.full_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#26A4E5]"
            >
              <span className="tracking-[5px]">{comm.key}</span>
              <Image src={telegram} alt="telegram" />
            </a>
          );
        }
        // else if (comm.key === 'rubika') {
        //   return (
        //     <a
        //       key={comm.key}
        //       href={comm.full_url}
        //       target="_blank"
        //       rel="noopener noreferrer"
        //       className="flex items-center gap-2 text-sm text-[#BEA6FB]"
        //     >
        //       <span className="tracking-[5px]">{comm.key}</span>
        //       <Image src={rubika} alt="rubika" />
        //     </a>
        //   );
        // }
        return null;
      })}
    </div>
  );
}