import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/global/Icon";
import { Calendar2, ArrowLeft } from "iconsax-reactjs";

type MagCardVariant = "vertical" | "featured";

type MagCardProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  date: string;
  excerpt?: string;
  variant?: MagCardVariant;
};

export default function MagCard({
  href,
  imageSrc,
  imageAlt,
  title,
  date,
  excerpt,
  variant = "vertical",
}: MagCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Link
      href={href}
      className="
        group flex flex-col justify-between p-2 rounded-lg h-full
        bg-primary-4
        hover:bg-secondary-black-3
        hover:shadow-xl
        transition-all duration-300
      "
    >
      {/* Image */}
      <div
        className={`relative shrink-0 rounded-xl overflow-hidden flex flex-col ${
          isFeatured ? "gap-3 mb-3" : "gap-2 mb-2"
        }`}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={isFeatured ? 650 : 310}
          height={isFeatured ? 370 : 160}
          className="object-cover w-full group-hover:brightness-110 transition-all duration-300"
        />

        {/* Date */}
        <div className="flex flex-row gap-1.5 text-primary-1 group-hover:text-white">
          <Icon
            IconComponent={Calendar2}
            size={15}
            className="text-primary-1 group-hover:text-white transition-colors duration-300"
            variant="Bold"
          />
          <span className="text-xs group-hover:text-white transition-colors duration-300">
            {date}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`
            line-clamp-2 font-normal text-secondary-black-3 group-hover:text-white transition-colors duration-300
            ${isFeatured ? "text-base md:text-lg leading-[26px]" : "text-sm md:text-base leading-[23px] md:leading-[26px]"}
          `}
        >
          {title}
        </h3>

        {/* Excerpt (only featured) */}
        {isFeatured && excerpt && (
          <p className="line-clamp-3 text-regular text-secondary-black-2 group-hover:text-white/90 transition-colors duration-300">
            {excerpt}
          </p>
        )}

      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-2">

        {/* CTA */}
        <button className="flex group-hover:gap-2 gap-1 justify-end items-center text-sm text-primary-1 transition-all duration-300">
          <span>مطالعه بیشتر</span>
          <Icon
            IconComponent={ArrowLeft}
            size={20}
            variant="TwoTone"
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </div>
    </Link>
  );
}