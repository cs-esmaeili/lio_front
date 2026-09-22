'use client';
import BasketListItem from './BasketListItem';
import type { BasketItem } from './basket.types';

interface BasketListProps {
  items: BasketItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const TABLE_HEADERS = ['تصویر', 'نام محصول', 'قیمت واحد', 'تعداد', 'جمع جز', ''];

export default function BasketList({ items, onQuantityChange, onRemove }: BasketListProps) {
  if (items.length === 0) {
    return <div className="text-center py-12 text-gray-400">سبد خرید خالی است</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            {TABLE_HEADERS.map((header, i) => (
              <th
                key={i}
                className="py-3 px-3 text-center text-sm font-medium text-gray-500 first:ps-0 last:pe-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <BasketListItem
              key={item.variantId}
              item={item}
              onQuantityChange={onQuantityChange}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
