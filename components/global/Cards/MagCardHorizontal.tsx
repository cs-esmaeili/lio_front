import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/global/Icon";
import { Calendar2 } from "iconsax-reactjs";

type MagCartItemProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  excerpt: string;
};

export default function MagCartItem({
  href,
  imageSrc,
  imageAlt,
  title,
  excerpt,
}: MagCartItemProps) {
  return (
    <Link
      href={href}
      className="
        group flex flex-row items-center py-2 
        border-b border-primary-3
        transition-all duration-300
      "
    >
      <div className="shrink-0 w-[4.75rem] h-[4.25rem] rounded-lg overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={76}
          height={68}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col justify-center pr-3">
        <h6 className="line-clamp-2 text-secondary-1 group-hover:text-primary-1">
          {title}
        </h6>
        <div className="hidden lg:flex flex-row text-secondary-2 text-[0.7rem] font-light leading-[1.1rem]">
          <p>{excerpt}</p>
        </div>
      </div>
    </Link>
  );
}
