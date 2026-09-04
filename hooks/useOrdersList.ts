'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import { ordersList } from '@/services/order.service';

import { mapOrder } from '@/components/dashboard/order/order.mapper';

import type { Order } from '@/components/dashboard/order/order.model';

import { getApiErrorMessage, isApiError } from '@/utils/api-error';


export interface OrdersPagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
}


export interface OrdersListResponse {
  orders: Order[];
  pagination: OrdersPagination;
}


const EMPTY_PAGINATION: OrdersPagination = {
  currentPage: 1,
  lastPage: 1,
  perPage: 0,
  total: 0,
  from: 0,
  to: 0,
};


export function useOrdersList() {
  const [loading, setLoading] = useState(false);


  const fetchOrders = useCallback(async (statusCode: number, page: number = 1): Promise<OrdersListResponse> => {
    setLoading(true);

    try {
      const response = await ordersList(statusCode, page);

      const data = response.data?.data ?? {};

      const orders: Order[] = (data.orders ?? []).map(mapOrder);

      const links = data.links ?? {};

      return {
        orders,

        pagination: {
          currentPage: Number(links.current_page ?? 1),

          lastPage: Number(links.last_page ?? 1),

          perPage: Number(links.per_page ?? 0),

          total: Number(links.total ?? 0),

          from: Number(links.from ?? 0),

          to: Number(links.to ?? 0),
        },
      };
    } catch (error) {
      if (isApiError(error) && error.handled) {
        return {
          orders: [],
          pagination: EMPTY_PAGINATION,
        };
      }

      toast.error(getApiErrorMessage(error, 'خطا در دریافت لیست سفارشات'));

      return {
        orders: [],
        pagination: EMPTY_PAGINATION,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  

  return {
    loading,
    fetchOrders,
  };
}
