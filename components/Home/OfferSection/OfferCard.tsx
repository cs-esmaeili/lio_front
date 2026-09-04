// OfferCard.tsx
"use client";

import styles from "@/styles/modules/Carves.module.css";
import stylesHome from "@/styles/modules/home.module.css";

import Link from "next/link";
import Icon from "@/components/global/Icon";
import { ArrowLeft, ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import Image from "next/image";
import offer from "@/public/home/offer.webp";
import offerM from "@/public/home/offer-m.webp";
import Timer from "@/components/Home/OfferSection/OfferTimer";

type Props = {
  onPrev: () => void;
  onNext: () => void;
  link: string;
  expiryTime?: number;
};

export default function OfferCard({
  onPrev,
  onNext,
  link,
  expiryTime = 3600,
}: Props) {
  return (
    <div
      className={`${stylesHome.gradientOffer} relative rounded-xl overflow-hidden w-full h-full flex flex-row lg:flex-col items-center justify-between md:justify-evenly gap-4 lg:gap-8 p-4 lg:p-0"`}
    >
      <Image className="hidden lg:block" src={offer} alt="offer" />
      <Image width={138} height={40} className="w-[138px] h-[40px] block lg:hidden" src={offerM} alt="offer" />

      <button
        className={`hidden lg:block absolute bottom-[30%] -translate-y-1/2 right-2 translate-x-1/2 z-10 cursor-pointer ${styles.rightCarve}`}
        onClick={onPrev}
      >
        <Icon
          IconComponent={ArrowRight2}
          size={24}
          variant="Outline"
          className="text-secondary-black-2 relative z-20 mt-[-35%]"
        />
      </button>

      <button
        className={`hidden lg:block absolute bottom-[30%] -translate-y-1/2 -translate-x-1/2 left-2 z-10 cursor-pointer ${styles.leftCarve}`}
        onClick={onNext}
      >
        <Icon
          IconComponent={ArrowLeft2}
          size={24}
          variant="Outline"
          className="text-secondary-black-2 relative z-20 mt-[-35%]"
        />
      </button>

      <Timer expiryTime={expiryTime} />

      <Link href={link}>
        <button
          className="hidden lg:flex h-12.5 group gap-2 justify-center items-center py-2 px-4 rounded-[8px] select-none bg-primary-4 text-primary-1
          hover:rounded-[50px] hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer "
        >
          <span>مشاهده بیشتر</span>
          <Icon
            IconComponent={ArrowLeft}
            size={24}
            variant="TwoTone"
            className="group-hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer"
          />
        </button>
        <button
          className="flex lg:hidden h-10 group gap-2 justify-center items-center py-2 px-4 rounded-[8px] select-none bg-primary-4 text-primary-1
          hover:rounded-[50px] hover:text-secondary-black-3 transition-all duration-1000 ease-in-out cursor-pointer text-[12px]"
        >
          <span>همه</span>
        </button>
      </Link>
    </div>
  );
}
