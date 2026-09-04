import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo-white.png";
import { Button } from "@/components/shadcn/button";
import Icon from "@/components/global/Icon";
import { ArrowRight } from "iconsax-reactjs";

type AuthHeaderProps = {
  onBack: () => void;
};

export function AuthHeader({ onBack }: AuthHeaderProps) {
  return (
    <div className="relative mb-10 flex items-center justify-center">
      <Button
        type="button"
        onClick={onBack}
        size="icon"
        variant="outline"
        className="absolute right-0 cursor-pointer p-4 bg-secondary-black-2! border-0"
      >
            <Icon
                      IconComponent={ArrowRight}
                      className='transition-colors duration-200 text-gray-1'
                      size={24}
                      aria-hidden='true'
                      variant='TwoTone'
                      toneTwoColor='--color-primary-1'
                    />
      </Button>

      <Link href="/">
        <Image src={logo} alt="logo" priority width={135} height={64} />
      </Link>
    </div>
  );
}