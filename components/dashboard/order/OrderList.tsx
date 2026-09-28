"use client";

import OrderCard from "@/components/dashboard/order/OrderCard";

import type { OrderSummary } from "@/typescript/schemas/order.schema";


interface OrderListProps {
    orders: OrderSummary[];

    onView?: (order: OrderSummary) => void;
}



export default function OrderList({
    orders,
}: OrderListProps) {
    return (
        <div className="flex w-full flex-col gap-4">
            {orders.map((order) => (
                <OrderCard
                    key={order.id}
                    order={order}
                />
            ))}
        </div>
    );
}
