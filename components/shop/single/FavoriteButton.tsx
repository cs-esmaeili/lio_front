'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Heart } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';
import { Spinner } from '@/components/shadcn/spinner';
import { getAuthToken } from '@/hooks/useAuth';
import { useAddFavorite } from '@/hooks/favorites/useAddFavorite';
import { useRemoveFavorite } from '@/hooks/favorites/useRemoveFavorite';

type Props = {
  barcode: string;
  productId: number;
  initiallyFavorited?: boolean;
};

export default function FavoriteButton({ barcode, productId, initiallyFavorited = false }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { addFavorite, loading: addLoading } = useAddFavorite();
  const { removeFavorite, loading: removeLoading } = useRemoveFavorite();

  const [isFavorited, setIsFavorited] = useState(initiallyFavorited);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoading = addLoading || removeLoading;

  const handleClick = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isLoading) return;

    const success = isFavorited
      ? await removeFavorite(barcode, productId)
      : await addFavorite(barcode, productId);

    if (success) {
      setIsFavorited(!isFavorited);
    }
  };

  const displayFavorited = mounted ? isFavorited : false;

  return (
    <button onClick={mounted ? handleClick : undefined} disabled={!mounted || isLoading}  className='cursor-pointer'>
      {isLoading ? (
        <Spinner className="size-[24px] text-primary-1" />
      ) : (
        <Icon
          IconComponent={Heart}
          size={24}
          variant={displayFavorited ? 'Bold' : 'Linear'}
          className="text-primary-1"
        />
      )}
    </button>
  );
}
