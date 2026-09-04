import styles from "@/styles/modules/borders/Astelam.module.css";
import Image from "next/image";

type Communication = {
  key: string;
  full_url: string;
};

const AstelamCard = ({ communications }: { communications: Communication[] }) => {
  if (!communications.some((comm) => comm.key === "rubika")) return null;
  return (
    <div className={`${styles.cardWrapper} p-[16px] flex flex-col gap-[16px]`}>
      {communications.map((comm) => {
        // فقط آیتم rubika را نمایش بده
        if (comm.key === 'rubika') {
          return (
            <a
              key={comm.key}
              href={comm.full_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex gap-[8px]">
                <div className="w-[56px] h-[56px] bg-gray-1 flex justify-center items-center rounded-full">
                  <Image
                    src="/global/rubika.png"
                    alt="روبیکا"
                    width={28}
                    height={32}
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h5 className="text-custom-purple">استعلام قیمت</h5>
                  <h6 className="text-secondary-2">
                    به‌روزترین قیمت بازار در کانال روبیکا دودیگرام
                  </h6>
                </div>
              </div>
            </a>
          );
        }
        return null;
      })}
    </div>
  );
};

export default AstelamCard;