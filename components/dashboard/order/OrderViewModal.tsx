"use client";

import ReusableModal from "@/components/global/Modal/ReusableModal";
import { Button } from "@/components/shadcn/button";

import OrderDetail from "@/components/dashboard/order/OrderDetail";

import type { Order } from '@/typescript/schemas/order.schema';



interface OrderViewModalProps {
    open: boolean;

    onOpenChange: (open: boolean) => void;

    order: Order | null;
}


export default function OrderViewModal({
    open,
    onOpenChange,
    order,
}: OrderViewModalProps) {
    //------------------------------------------------------

    const handleClose = () => {
        onOpenChange(false);
    };

    //------------------------------------------------------

    if (!order) {
        return null;
    }

    //------------------------------------------------------

    return (
        <ReusableModal
            open={open}
            onOpenChange={onOpenChange}
            title="جزئیات سفارش"
            size="xl"
            footer={
                <Button
                    className="h-12 w-full rounded-xl"
                    onClick={handleClose}
                >
                    بستن
                </Button>
            }
        >
            <OrderDetail order={order} />
        </ReusableModal>
    );
}
