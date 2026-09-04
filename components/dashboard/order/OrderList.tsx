"use client";

import OrderCard from "@/components/dashboard/order/OrderCard";

import type { Order } from "@/components/dashboard/order/order.model";


interface OrderListProps {
    orders: Order[];

    onView: (order: Order) => void;
}



export default function OrderList({
    orders,
    onView,
}: OrderListProps) {
    return (
        <div className="flex w-full flex-col gap-4">
            {orders.map((order) => (
                <OrderCard
                    key={order.id}
                    order={order}
                    onView={onView}
                />
            ))}
        </div>
    );
}
