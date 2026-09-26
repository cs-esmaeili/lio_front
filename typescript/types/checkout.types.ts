/* -------------------------------------------------------------------------- */
/*  Checkout page — non-domain view types                                      */
/*  Cart/pricing/address models come from zod schemas:                         */
/*    @/typescript/schemas/checkout.schema                                     */
/*    @/typescript/schemas/address.schema                                      */
/* -------------------------------------------------------------------------- */

export interface OrderInvoiceGateway {
  title: string;
  amount: number;
  successful: boolean;
  is_card: boolean;
}

export interface OrderInvoiceOrder {
  id: number;
  code: number;
  is_payment: number;
  final_amount: number;
  currency_symbol: string;
}

export interface OrderInvoiceResponse {
  status: number;
  data: {
    order: OrderInvoiceOrder;
    gateways: OrderInvoiceGateway[];
  };
}
