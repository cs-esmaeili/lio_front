import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Orders contract — /profile/orders, /admin/orders                          */
/* -------------------------------------------------------------------------- */

export const ORDER_STATUSES = ['PENDING_PAYMENT', 'PAID', 'CANCELED', 'EXPIRED', 'FAILED'] as const;

export const OrderStatusSchema = z.enum(ORDER_STATUSES);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

/** Persian labels for the backend `OrderStatus` enum. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'در انتظار پرداخت',
  PAID: 'پرداخت شده',
  CANCELED: 'لغو شده',
  EXPIRED: 'منقضی شده',
  FAILED: 'ناموفق',
};

/**
 * Numeric "tone" kept for the existing order card/stat colour switches. The
 * backend only exposes an enum; these ids only drive presentation.
 */
export const ORDER_STATUS_TONES: Record<OrderStatus, number> = {
  PENDING_PAYMENT: -1,
  PAID: 2,
  CANCELED: 4,
  EXPIRED: 5,
  FAILED: 3,
};

/** Brand-token badge classes for each status (admin tables). */
export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'bg-primary-4 text-primary-1',
  PAID: 'bg-primary-0/15 text-primary-0',
  CANCELED: 'bg-custom-red/10 text-custom-red',
  EXPIRED: 'bg-gray-1 text-secondary-2',
  FAILED: 'bg-custom-red/10 text-custom-red',
};

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? 'تومان';

/** Parse an ISO timestamp into a Gregorian Persian-locale string. */
export function formatOrderDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('fa-IR');
}

/* -------------------------------------------------------------------------- */
/*  API schemas (snake-free, camelCase as the backend emits)                   */
/* -------------------------------------------------------------------------- */

/** Item row of `GET /profile/orders` and `GET /admin/orders`. */
export const OrderListItemSchema = z.object({
  id: z.number(),
  orderNumber: z.string().catch(''),
  status: OrderStatusSchema.catch('PENDING_PAYMENT'),
  total: z.number().catch(0),
  itemCount: z.number().catch(0),
  createdAt: z.string().catch(''),
  paidAt: z.string().nullable().catch(null),
});

/** Admin rows add the owning account and the customer snapshot. */
export const AdminOrderListItemSchema = OrderListItemSchema.extend({
  customerName: z.string().catch(''),
  phone: z.string().catch(''),
  userId: z.number().nullable().catch(null),
  username: z.string().nullable().catch(null),
});

export const OrderListResponseSchema = z.object({
  items: z.array(OrderListItemSchema).catch([]),
  page: z.number().catch(1),
  limit: z.number().catch(20),
  total: z.number().catch(0),
  totalPages: z.number().catch(1),
});

export const AdminOrderListResponseSchema = z.object({
  items: z.array(AdminOrderListItemSchema).catch([]),
  page: z.number().catch(1),
  limit: z.number().catch(20),
  total: z.number().catch(0),
  totalPages: z.number().catch(1),
});

const ApiOrderLineSchema = z.object({
  id: z.number(),
  productId: z.number().nullable().catch(null),
  productName: z.string().catch(''),
  productSlug: z.string().catch(''),
  sku: z.string().catch(''),
  unitPrice: z.number().catch(0),
  quantity: z.number().catch(0),
  lineTotal: z.number().catch(0),
  imageUrl: z.string().nullable().catch(null),
});

const ApiOrderSummarySchema = z.object({
  id: z.number(),
  orderNumber: z.string().catch(''),
  status: OrderStatusSchema.catch('PENDING_PAYMENT'),
  subtotal: z.number().catch(0),
  discount: z.number().catch(0),
  shippingCost: z.number().catch(0),
  total: z.number().catch(0),
  createdAt: z.string().catch(''),
  paidAt: z.string().nullable().catch(null),
});

const ApiOrderCustomerSchema = z
  .object({
    firstName: z.string().catch(''),
    lastName: z.string().catch(''),
    phone: z.string().catch(''),
    company: z.string().nullable().catch(null),
  })
  .catch({ firstName: '', lastName: '', phone: '', company: null });

const ApiOrderAddressSchema = z
  .object({
    province: z.string().catch(''),
    city: z.string().catch(''),
    address: z.string().catch(''),
    postalCode: z.string().catch(''),
  })
  .catch({ province: '', city: '', address: '', postalCode: '' });

const ApiOrderPaymentSchema = z
  .object({
    provider: z.string().nullable().catch(null),
    status: z.string().nullable().catch(null),
    refId: z.string().nullable().catch(null),
  })
  .nullable()
  .catch(null);

const ApiOrderDetailSchema = ApiOrderSummarySchema.extend({
  updatedAt: z.string().catch(''),
  canceledAt: z.string().nullable().catch(null),
  expiresAt: z.string().catch(''),
  customer: ApiOrderCustomerSchema,
  shippingAddress: ApiOrderAddressSchema,
  payment: ApiOrderPaymentSchema,
  items: z.array(ApiOrderLineSchema).catch([]),
  // Present only on the admin contract; ignored by the customer contract.
  userId: z.number().nullable().catch(null),
  username: z.string().nullable().catch(null),
});

/* -------------------------------------------------------------------------- */
/*  Domain models (component-facing)                                          */
/* -------------------------------------------------------------------------- */

export const OrderLineSchema = ApiOrderLineSchema.transform((line) => ({
  id: String(line.id),
  productId: line.productId ?? 0,
  title: line.productName,
  slug: line.productSlug,
  sku: line.sku,
  image: line.imageUrl ?? '',
  quantity: line.quantity,
  unitPrice: line.unitPrice,
  lineTotal: line.lineTotal,
  currency: CURRENCY,
}));

export const OrderSummarySchema = OrderListItemSchema.transform((order) => ({
  id: String(order.id),
  orderNumber: order.orderNumber,
  status: order.status,
  statusId: ORDER_STATUS_TONES[order.status],
  statusTitle: ORDER_STATUS_LABELS[order.status],
  createdAt: formatOrderDate(order.createdAt),
  total: order.total,
  itemCount: order.itemCount,
}));

export const AdminOrderSummarySchema = AdminOrderListItemSchema.transform((order) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  status: order.status,
  statusId: ORDER_STATUS_TONES[order.status],
  statusTitle: ORDER_STATUS_LABELS[order.status],
  customerName: order.customerName,
  phone: order.phone,
  userId: order.userId,
  username: order.username,
  createdAt: formatOrderDate(order.createdAt),
  total: order.total,
  itemCount: order.itemCount,
}));

export const OrderSchema = ApiOrderDetailSchema.transform((order) => ({
  id: String(order.id),
  orderNumber: order.orderNumber,
  createdAt: formatOrderDate(order.createdAt),
  status: order.status,
  statusId: ORDER_STATUS_TONES[order.status],
  statusTitle: ORDER_STATUS_LABELS[order.status],
  payment: { isPaid: order.status === 'PAID' },
  shipping: {
    method: '—',
    deliveryDate: '',
    trackingCode: '-',
  },
  customer: {
    name: [order.customer.firstName, order.customer.lastName].filter(Boolean).join(' '),
    mobile: order.customer.phone,
    address: [order.shippingAddress.province, order.shippingAddress.city, order.shippingAddress.address].filter(Boolean).join('، '),
  },
  price: {
    subtotal: order.subtotal,
    discount: order.discount,
    coupon: 0,
    shippingCost: order.shippingCost,
    vat: 0,
    totalPrice: order.total,
    currency: CURRENCY,
    cardDiscount: null as number | null,
    transactionFile: null as string | null,
  },
  owner: { userId: order.userId, username: order.username },
  items: order.items.map((item) => OrderLineSchema.parse(item)),
}));

/** `GET /profile/orders` mapped to the component-facing summaries. */
export const MyOrdersListSchema = OrderListResponseSchema.transform((response) => ({
  items: response.items.map((item) => OrderSummarySchema.parse(item)),
  page: response.page,
  limit: response.limit,
  total: response.total,
  totalPages: response.totalPages,
}));

/** `GET /admin/orders` mapped to the component-facing summaries. */
export const AdminOrdersListSchema = AdminOrderListResponseSchema.transform((response) => ({
  items: response.items.map((item) => AdminOrderSummarySchema.parse(item)),
  page: response.page,
  limit: response.limit,
  total: response.total,
  totalPages: response.totalPages,
}));

export type OrderListItem = z.infer<typeof OrderListItemSchema>;
export type OrderListResponse = z.infer<typeof OrderListResponseSchema>;
export type AdminOrderListItem = z.infer<typeof AdminOrderListItemSchema>;
export type AdminOrderListResponse = z.infer<typeof AdminOrderListResponseSchema>;
export type OrderLine = z.infer<typeof OrderLineSchema>;
export type OrderSummary = z.infer<typeof OrderSummarySchema>;
export type AdminOrderSummary = z.infer<typeof AdminOrderSummarySchema>;
export type Order = z.infer<typeof OrderSchema>;
export type MyOrdersList = z.infer<typeof MyOrdersListSchema>;
export type AdminOrdersList = z.infer<typeof AdminOrdersListSchema>;
