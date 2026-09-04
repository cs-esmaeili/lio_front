"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shadcn/tabs";
import { ShoppingBag } from "lucide-react";
import { ShoppingCart } from "iconsax-reactjs";
import Icon from "@/components/global/Icon";
import PageHeader from "@/components/dashboard/PageHeader";

// Mock order status counts – replace with real data
const orderCounts = {
  pending: 0,    // در حال انجام
  completed: 0,  // تکمیل شده
  cancelled: 0,  // لغو شده
};

const orders = []; // empty for now

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState("pending");
  const pageInfo = { href: "/dashboard", label: "سفارش های من", icon: ShoppingCart }

  return (
    <>
      <div className="flex flex-col items-start gap-6 rounded-2xl shadow-sm p-6 h-full">


      </div>

      <div className="flex flex-col items-start gap-6 rounded-2xl shadow-sm p-6 h-full">
        {/* Header – only as wide as its content */}
        {/* <PageHeader>
          <div className="inline-flex items-center gap-2 pb-1 pl-1 border-b border-primary-1">
            <Icon
              IconComponent={pageInfo.icon}
              className="transition-colors duration-200 text-secondary-black-3"
              size={24}
              aria-hidden="true"
              variant="TwoTone"
              toneTwoColor="--color-primary-1"
            />
            <span className="text-regular text-secondary-1">{pageInfo.label}</span>
          </div>
        </PageHeader> */}


      </div>

    </>
  );
}

function EmptyOrdersState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ShoppingBag size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">هندوز هیچ سفارشی ندازید</h3>
      <p className="text-gray-500">سفارش خود را ثبت کنید تا در اینجا نمایش داده شود</p>
    </div>
  );
}
/* Tabs for order status */
// <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
//   <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
//     <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white">
//       در حال انجام {orderCounts.pending > 0 && `(${orderCounts.pending})`}
//     </TabsTrigger>
//     <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-white">
//       تکمیل شده {orderCounts.completed > 0 && `(${orderCounts.completed})`}
//     </TabsTrigger>
//     <TabsTrigger value="cancelled" className="rounded-lg data-[state=active]:bg-white">
//       لغو شده {orderCounts.cancelled > 0 && `(${orderCounts.cancelled})`}
//     </TabsTrigger>
//   </TabsList>

//   <TabsContent value="pending" className="mt-6">
//     {orders.length === 0 ? (
//       <EmptyOrdersState />
//     ) : (
//       <div>{/* Order list component */}</div>
//     )}
//   </TabsContent>

//   <TabsContent value="completed" className="mt-6">
//     {orders.length === 0 ? <EmptyOrdersState /> : <div>{/* Orders */}</div>}
//   </TabsContent>

//   <TabsContent value="cancelled" className="mt-6">
//     {orders.length === 0 ? <EmptyOrdersState /> : <div>{/* Orders */}</div>}
//   </TabsContent>
// </Tabs>


