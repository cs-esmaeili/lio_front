import Image from "next/image";
import Link from "next/link";

import logoFallback from "@/public/logo.webp";
import { Button } from "@/components/shadcn/button";
import Icon from "@/components/global/Icon";
import { ArrowRight } from "iconsax-reactjs";

type AuthHeaderProps = {
  onBack: () => void;
  logo?: string;
};

export function AuthHeader({ onBack, logo }: AuthHeaderProps) {
  return (
    <div className="relative mb-10 flex items-center justify-center">
      <Button
        type="button"
        onClick={onBack}
        size="icon"
        variant="ghost"
        className="absolute right-0 cursor-pointer p-4 hover:bg-gray-1"
      >
            <Icon
                      IconComponent={ArrowRight}
                      className='transition-colors duration-200 text-secondary-black-3'
                      size={24}
                      aria-hidden='true'
                      variant='TwoTone'
                      toneTwoColor='--color-primary-1'
                    />
      </Button>

      <Link href="/">
        <Image src={logo || logoFallback} alt="logo" priority width={135} height={64} />
      </Link>
    </div>
  );
}
