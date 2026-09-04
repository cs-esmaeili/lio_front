"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { orderDetail } from "@/services/order.service";

import { mapOrder } from "@/components/dashboard/order/order.mapper";

import type { Order } from "@/components/dashboard/order/order.model";

import {
    getApiErrorMessage,
    isApiError,
} from "@/utils/api-error";



export function useOrderDetail() {
    //------------------------------------------------------

    const [loading, setLoading] = useState(false);

    const [order, setOrder] =
        useState<Order | null>(null);

    //------------------------------------------------------

    const fetchOrder = useCallback(
        async (id: string | number) => {
            setLoading(true);

            try {
                const response =
                    await orderDetail(id);

                const apiOrder =
                    response.data?.data?.order ??
                    response.data?.order ??
                    response.data;

                const mappedOrder =
                    mapOrder(apiOrder);

                setOrder(mappedOrder);

                return mappedOrder;
            } catch (error: unknown) {
                if (
                    isApiError(error) &&
                    error.handled
                ) {
                    return null;
                }

                toast.error(
                    getApiErrorMessage(
                        error,
                        "دریافت اطلاعات سفارش با خطا مواجه شد."
                    )
                );

                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    //------------------------------------------------------

    return {
        loading,
        order,
        fetchOrder,
    };
}
