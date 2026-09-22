import type { CartItem } from '@/typescript/schemas/cart.schema';

export type BasketItem = CartItem & { isUpdating?: boolean };
