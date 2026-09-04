"use client";

import Icon from "@/components/global/Icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import { ShoppingCart } from "iconsax-reactjs";

// داده‌های نمونه - بعداً می‌توانید از props یا context بگیرید
const cartItems = [
  { id: 1, name: "محصول ۱", price: "۲۵۰,۰۰۰", quantity: 1 },
  { id: 2, name: "محصول ۲", price: "۱۸۰,۰۰۰", quantity: 2 },
];

export default function CartPopover() {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + parseInt(item.price.replace(/,/g, "")) * item.quantity,
    0,
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-center rounded-lg bg-primary-3 w-9 h-9 relative cursor-pointer hover:rounded-full">
          <Icon
            IconComponent={ShoppingCart}
            className="text-secondary-black-3"
            size={24}
            aria-hidden="true"
            variant="TwoTone"
            toneTwoColor="--color-primary-1"
          />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">سبد خرید</h3>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              سبد خرید خالی است
            </div>
          ) : (
            <div className="divide-y">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      تعداد: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{item.price} {process.env.NEXT_PUBLIC_CURRENCY}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between mb-3">
              <span className="font-semibold">مجموع:</span>
              <span className="font-bold text-lg">
                {totalPrice.toLocaleString()} {process.env.NEXT_PUBLIC_CURRENCY}
              </span>
            </div>
            <button className="w-full bg-primary text-white rounded-lg py-2 hover:bg-primary/90 transition-colors">
              پرداخت
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
