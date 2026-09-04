// CartItemRow.tsx
"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import CurrencyLabel from "@/components/global/Cards/CurrencyLabel";
import { SuccessCheckbox } from "@/components/global/Checkboxes/SuccessCheckBox";
interface CartItem {
  id: string;
  name: string;
  pricePerPiece: number;
  pricePerBox: number;
  originalPricePerPiece?: number;
  originalPricePerBox?: number;
  quantity: number;
  image: string;
  isBox: boolean;
}

interface ProductCardSideBarProps {
    item: CartItem;
    onUpdateQuantity: (id: string, newQuantity: number) => void;
    onRemoveItem: (id: string) => void;
    onUnitToggle: (id: string, isBox: boolean) => void;
}
export function ProductCardSideBar({
    item,
    onUpdateQuantity,
    onRemoveItem,
    onUnitToggle,
}: ProductCardSideBarProps) {
    const getCurrentPrice = () => item.isBox ? item.pricePerBox : item.pricePerPiece;
    const getOriginalPrice = () => {
        if (item.isBox && item.originalPricePerBox) return item.originalPricePerBox;
        if (!item.isBox && item.originalPricePerPiece) return item.originalPricePerPiece;
        return null;
    };

    const currentPrice = getCurrentPrice();
    const originalPrice = getOriginalPrice();
    const hasDiscount = originalPrice !== null && originalPrice > currentPrice;

    return (
        <div className="w-full border-b border-gray-100 pb-1 last:border-0">
            {/* Row 1: Image, name, delete button */}
            <div className="flex gap-4">
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex-1 flex justify-between items-center">
                    <h4 className="font-medium text-regular text-gray-800">{item.name}</h4>
                    <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 transition">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Row 2: Checkbox + Quantity controls */}
            <div className="flex justify-between items-center mt-3">
                <SuccessCheckbox
                    checked={item.isBox}
                    onChange={(checked) => onUnitToggle(item.id, checked)}
                    label={item.isBox ? "باکس" : "تک"}
                />
                <div className="flex items-center gap-2 border rounded-lg !border-secondary-2 px-3 py-2">
                    <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                    >
                        <Minus className="text-primary-1" size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="text-primary-1" size={14} />
                    </button>
                </div>
            </div>

            {/* Row 3: Price display */}
            <div className="text-left mt-4">
                <div className="flex flex-row gap-4 items-end justify-end">
                    {hasDiscount && (
                        <div className="text-secondary-3 line-through">{originalPrice.toLocaleString()}</div>
                    )}
                    <div className="flex flex-row justify-end items-start gap-1">
                        <div className="text-secondary-black-1">{currentPrice.toLocaleString()}</div>
                        <CurrencyLabel />
                    </div>
                </div>
                {item.quantity > 1 && (
                    <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-2">
                        <span className="text-regular text-gray-600">مجموع:</span>
                        <div className="flex items-center gap-1">
                            <span className="text-regular text-gray-600">{(currentPrice * item.quantity).toLocaleString()}</span>
                            <CurrencyLabel />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}