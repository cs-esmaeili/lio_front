'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PageHeader from '@/components/dashboard/PageHeader';
import OrderList from '@/components/dashboard/order/OrderList';
import OrderViewModal from '@/components/dashboard/order/OrderViewModal';
import type { Order, Pagination } from '@/components/dashboard/order/order.model';
import { ORDER_STATUSES, type OrderStatusItem } from '@/components/dashboard/order/order.status';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import { useOrdersList } from '@/hooks/useOrdersList';

function OrderContentWrapper({ children }: { children: React.ReactNode }) {
  return <div className='flex h-full w-full rounded-md'>{children}</div>;
}

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState<number>(ORDER_STATUSES[0]?.id ?? 1);

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [ordersMap, setOrdersMap] = useState<Map<number, Order[]>>(new Map());
  const [ordersCountMap, setOrdersCountMap] = useState<Map<number, number>>(new Map());

  const [loadingTabs, setLoadingTabs] = useState<Map<number, boolean>>(new Map());

  const { fetchOrders } = useOrdersList();

  const loadedTabs = useRef<Set<number>>(new Set());

  const loadOrders = useCallback(
    async (tabId: number, statusCode: number, page: number = 1) => {
      if (loadedTabs.current.has(tabId)) {
        return;
      }

      if (loadingTabs.get(tabId)) {
        return;
      }

      setLoadingTabs((prev) => {
        const map = new Map(prev);
        map.set(tabId, true);
        return map;
      });

      try {
        const result = await fetchOrders(statusCode, page);

        setOrdersMap((prev) => {
          const map = new Map(prev);

          map.set(tabId, result.orders);

          return map;
        });

        setOrdersCountMap((prev) => {
          const map = new Map(prev);

          map.set(tabId, result.pagination.total);

          return map;
        });

        setPagination(result.pagination);

        loadedTabs.current.add(tabId);
      } finally {
        setLoadingTabs((prev) => {
          const map = new Map(prev);
          map.set(tabId, false);
          return map;
        });
      }
    },
    [fetchOrders, loadingTabs]
  );

  useEffect(() => {
    if (!ORDER_STATUSES.length) return;

    ORDER_STATUSES.forEach((status) => {
      loadOrders(status.id, status.statusCode, 1);
    });
  }, [loadOrders]);

  const handleTabChange = (value: string) => {
    const tabId = Number(value);

    setActiveTab(tabId);

    setCurrentPage(1);

    const currentTab = ORDER_STATUSES.find((item) => item.id === tabId);

    if (!currentTab) return;

    loadOrders(currentTab.id, currentTab.statusCode, 1);
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);

    setIsViewModalOpen(true);
  };

  const currentOrders = ordersMap.get(activeTab) ?? [];

  const isCurrentLoading = loadingTabs.get(activeTab) ?? false;

  return (
    <>
      <div className='flex h-full flex-col gap-6 rounded-2xl border-2 border-gray-1 p-4'>
        <Tabs value={String(activeTab)} onValueChange={handleTabChange} dir='rtl' className='flex flex-1 flex-col gap-6'>
          <PageHeader
            titleSlot={
              <TabsList variant='line' className='flex !h-auto w-full justify-start gap-5'>
                {ORDER_STATUSES.map((status: OrderStatusItem) => (
                  <TabsTrigger
                    key={status.id}
                    value={String(status.id)}
                    className='group flex-none text-regular text-gray-3 hover:text-primary-1 data-[state=active]:text-primary-1 after:bg-primary-1'>
                    {status.title}

                    {ordersCountMap.has(status.id) && (
                      <span className='flex h-6 w-6 items-center justify-center rounded-sm bg-gray-1 text-xs text-gray-3 group-data-[state=active]:bg-primary-1 group-data-[state=active]:text-white'>
                        {ordersCountMap.get(status.id)}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            }
          />

          {ORDER_STATUSES.map((status: OrderStatusItem) => {
            const orders = ordersMap.get(status.id) ?? [];

            const isLoading = loadingTabs.get(status.id) ?? false;

            const isLoaded = loadedTabs.current.has(status.id);

            return (
              <TabsContent key={status.id} value={String(status.id)} className='flex-1'>
                <OrderContentWrapper>
                  {isLoading && orders.length === 0 ? (
                    <div className='flex h-full w-full min-h-64 flex-1 flex-col items-center justify-center'>
                      <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-1' />
                    </div>
                  ) : orders.length === 0 && isLoaded ? (
                    <div className='flex h-full w-full min-h-64 flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed border-primary-1 text-center'>
                      <div className='relative mb-4 h-20 w-20'>
                        <Image src='/icons/empty-data.svg' alt='No Orders' fill className='object-contain' />
                      </div>

                      <h5 className='text-gray-3'>هنوز سفارشی وجود ندارد</h5>

                    </div>
                  ) : (
                    <OrderList orders={orders} onView={handleView} />
                  )}
                </OrderContentWrapper>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      <OrderViewModal open={isViewModalOpen} onOpenChange={setIsViewModalOpen} order={selectedOrder} />
    </>
  );
}
