// OfferCard.tsx
"use client";

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

const arrowClass =
  "flex size-9 cursor-pointer items-center justify-center rounded-full bg-custom-white/15 text-custom-white transition-colors hover:bg-custom-white hover:text-primary-1";

export default function OfferCard({ onPrev, onNext, link, expiryTime = 3600 }: Props) {
  return (
    <div className="relative flex h-full w-full flex-row items-center justify-between gap-4 overflow-hidden rounded-2xl bg-primary-1 p-4 lg:flex-col lg:justify-center lg:gap-7 lg:p-6">
      <span className="pointer-events-none absolute -left-10 -top-10 size-40 rounded-full bg-primary-2/40 blur-3xl" />

      <Image className="relative hidden lg:block" src={offer} alt="offer" />
      <Image width={138} height={40} className="relative block h-10 w-[138px] lg:hidden" src={offerM} alt="offer" />

      <Timer expiryTime={expiryTime} />

      <Link
        href={link}
        className="relative h-10.5 flex items-center justify-center gap-2 rounded-xl bg-custom-white px-5 text-sm font-semibold text-primary-1 transition-colors hover:bg-primary-4 lg:h-12.5"
      >
        <span className="hidden lg:inline">مشاهده بیشتر</span>
        <span className="lg:hidden">همه</span>
        <Icon IconComponent={ArrowLeft} size={20} variant="TwoTone" className="text-primary-1" />
      </Link>

      <div className="relative hidden items-center gap-2 lg:flex">
        <button type="button" onClick={onPrev} aria-label="اسلاید قبلی" className={arrowClass}>
          <Icon IconComponent={ArrowRight2} size={20} variant="Linear" className="text-current" />
        </button>
        <button type="button" onClick={onNext} aria-label="اسلاید بعدی" className={arrowClass}>
          <Icon IconComponent={ArrowLeft2} size={20} variant="Linear" className="text-current" />
        </button>
      </div>
    </div>
  );
}
