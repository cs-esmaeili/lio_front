import type { Order } from "@/components/dashboard/order/order.model";


export function mapOrder(apiOrder: any): Order {
    return {
        id: String(apiOrder.id),

        orderNumber: String(apiOrder.code),

        createdAt: apiOrder.created_at ?? "",

        statusId:
            apiOrder.status_information?.value ??
            apiOrder.status_code ??
            0,

        statusTitle:
            apiOrder.status_information?.title ??
            apiOrder.status ??
            "",

        payment: {
            isPaid: Boolean(apiOrder.is_payment),
        },

        shipping: {
            method:
                apiOrder.shipping_method?.title ??
                "—",

            deliveryDate:
                apiOrder.shipping_method?.date ??
                "",

            trackingCode:
                apiOrder.shipping_method?.tracking_code ??
                "-",
        },

        customer: {
            name:
                apiOrder.address?.full_name ??
                "",

            mobile:
                apiOrder.address?.mobile ??
                "",

            address:
                apiOrder.address?.address ??
                "",
        },

        price: {
            subtotal:
                apiOrder.price_details?.base_amount ??
                0,

            discount:
                apiOrder.price_details?.base_discount ??
                0,

            coupon:
                apiOrder.price_details?.coupon_amount ??
                0,

            shippingCost:
                apiOrder.price_details?.post_amount ??
                0,

            vat:
                apiOrder.price_details?.vat_amount ??
                0,

            totalPrice:
                apiOrder.payable_price ??
                apiOrder.price_details?.final_amount ??
                0,

            currency:
                apiOrder.currency_symbol ??
                process.env.NEXT_PUBLIC_CURRENCY,

            cardDiscount:
                apiOrder.price_details?.discount_card ?? null,

            transactionFile:
                apiOrder.price_details?.transaction_file ?? null,
          
        },

        items: (apiOrder.order_items ?? []).map(
            (item: any) => ({
                id: String(item.id),

                productId:
                    item.product?.product_id ?? 0,

                title:
                    item.product?.title ?? "",

                slug:
                    item.product?.slug ?? "",

                image:
                    item.product?.image ?? "",

                quantity:
                    item.quantity ?? 0,

                unitPrice:
                    item.product?.base_amount ?? 0,

                currency:
                    apiOrder.currency_symbol ??
                    process.env.NEXT_PUBLIC_CURRENCY,
            })
        ),
    };
}


export function mapOrders(
    orders: any[]
): Order[] {
    return orders.map(mapOrder);
}
