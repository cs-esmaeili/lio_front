export interface OrderStatusItem {
  id: number;
  statusCode: number;
  title: string;
  color: string;
}

export const ORDER_STATUSES: OrderStatusItem[] = [
  {
    id: 1,
    statusCode: -1,
    title: 'در انتظار پرداخت',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 2,
    statusCode: 0,
    title: 'در حال انجام',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 3,
    statusCode: 1,
    title: 'ارسال به انبار',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 4,
    statusCode: 2,
    title: 'ارسال شده',
    color: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 5,
    statusCode: 3,
    title: 'ارسال ناقص',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 6,
    statusCode: 4,
    title: 'لغو',
    color: 'bg-red-100 text-red-700',
  },
  {
    id: 7,
    statusCode: 5,
    title: 'استرداد شده',
    color: 'bg-gray-200 text-gray-700',
  },
  {
    id: 8,
    statusCode: 6,
    title: 'کارت به کارت',
    color: 'bg-gray-200 text-gray-700',
  },
];
