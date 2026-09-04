import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/global/Icon";
import { Calendar2, ArrowLeft } from "iconsax-reactjs";

type MagCartItemProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  date: string;
  excerpt: string;
};

export default function MagCartItem({
  href,
  imageSrc,
  imageAlt,
  title,
  date,
  excerpt,
}: MagCartItemProps) {
  return (
    <Link
      href={href}
      className="
        group flex flex-col p-2 rounded-lg h-full
        bg-primary-4
        hover:bg-secondary-black-3
        hover:shadow-[0_8px_24px_0_rgba(0,0,0,0.3)]
        transition-all duration-300
      "
    >
      <div className="relative shrink-0 rounded-xl overflow-hidden mb-3">
        <Image 
          src={imageSrc} 
          alt={imageAlt} 
          width={650} 
          height={370} 
          className="object-cover w-full group-hover:brightness-110 transition-all duration-300" 
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-1.5 text-primary-1 group-hover:text-white">
          <Icon
            IconComponent={Calendar2}
            size={15}
            className="text-primary-1 group-hover:text-white transition-colors duration-300"
            variant="Bold"
          />
          <span className="text-xs group-hover:text-white transition-colors duration-300">{date}</span>
        </div>

        <h3 className="line-clamp-2 h-12 text-base md:text-lg font-normal leading-[23px] md:leading-[26px] text-secondary-black-3 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>

        <p className="line-clamp-3 text-regular text-secondary-black-2 group-hover:text-white/90 transition-colors duration-300">
          {excerpt}
        </p>

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