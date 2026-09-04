import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/global/Icon";
import { Calendar2 } from "iconsax-reactjs";

type MagCartItemProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  date: string;
};

export default function MagCartItem({
  href,
  imageSrc,
  imageAlt,
  title,
  date,
}: MagCartItemProps) {
  return (
    <Link
      href={href}
      className="
        group flex flex-row p-2 rounded-lg 
        bg-gray-1
        hover:bg-linear-to-r hover:from-primary-3 hover:to-primary-1
        hover:shadow-[0_8px_24px_0_var(--color-primary-3)]
        transition-all duration-300
      "
    >
      <div className="h-full flex items-center justify-center">
        <div className="relative shrink-0 w-22 h-22 rounded-md overflow-hidden border">
          <Image src={imageSrc} alt={imageAlt} fill sizes="88px" className="object-cover" />
        </div>
      </div>
      <div className="flex flex-col gap-2 pr-3 pt-2.5 pb-3">
        <span className="line-clamp-2 h-12 text-sm md:text-base font-light leading-5.75 md:leading-6.5 text-secondary-black-3">
          {title}
        </span>
        <div className="flex flex-row  items-center gap-1.5 text-primary-1 group-hover:text-secondary-1">
          <Icon
            IconComponent={Calendar2}
            size={15}
            className="text-primary-1 group-hover:text-secondary-1"
            variant="Bold"
          />
          <span className="text-xs group-hover:text-secondary-1 ">{date}</span>
        </div>
      </div>
    </Link>
  );
}
