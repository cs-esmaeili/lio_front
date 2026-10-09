// OfferCard.tsx
"use client";

import Link from "next/link";
import Icon from "@/components/global/Icon";
import { ArrowLeft } from "iconsax-reactjs";
import Timer from "@/components/Home/OfferSection/OfferTimer";

type Props = {
  link: string;
  expiryTime?: number;
};

export default function OfferCard({ link, expiryTime = 3600 }: Props) {
  return (
    <div className="relative flex h-full w-full flex-row items-center justify-between gap-4 overflow-hidden rounded-2xl bg-primary-1 p-4 lg:flex-col lg:justify-center lg:gap-7 lg:p-6">
      <span className="pointer-events-none absolute -left-10 -top-10 size-40 rounded-full bg-primary-2/40 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-12 -right-10 size-40 rounded-full bg-primary-2/30 blur-3xl" />

      <div className="relative flex flex-col items-center gap-1.5 text-center">
        <h3 className="text-lg font-extrabold leading-7 text-custom-white lg:text-3xl lg:leading-10">
          پیشنهاد <span className="text-primary-3">شگفت‌انگیز</span> روز
        </h3>
      </div>

      <Timer expiryTime={expiryTime} />

      <Link
        href={link}
        className="relative flex h-10.5 items-center justify-center gap-2 rounded-xl bg-custom-white px-5 text-sm font-semibold text-primary-1 transition-colors hover:bg-primary-4 lg:h-12.5"
      >
        <span className="hidden lg:inline">مشاهده بیشتر</span>
        <span className="lg:hidden">همه</span>
        <Icon IconComponent={ArrowLeft} size={20} variant="TwoTone" className="text-primary-1" />
      </Link>
    </div>
  );
}
