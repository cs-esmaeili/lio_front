import type { CartProductItem } from '@/hooks/shop/useCart';

export type BasketItem = CartProductItem & { isUpdating?: boolean };