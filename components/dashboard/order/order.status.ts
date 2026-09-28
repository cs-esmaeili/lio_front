import { ORDER_STATUS_CLASSES, ORDER_STATUS_LABELS, ORDER_STATUSES, type OrderStatus } from '@/typescript/schemas/order.schema';

/** `ALL` shows every status; the remaining keys mirror the backend enum. */
export type OrderStatusFilter = OrderStatus | 'ALL';

export interface OrderStatusTab {
  key: OrderStatusFilter;
  title: string;
  color: string;
}

export const ORDER_STATUS_TABS: OrderStatusTab[] = [
  { key: 'ALL', title: 'همه', color: 'bg-gray-1 text-secondary-2' },
  ...ORDER_STATUSES.map((status) => ({
    key: status,
    title: ORDER_STATUS_LABELS[status],
    color: ORDER_STATUS_CLASSES[status],
  })),
];
