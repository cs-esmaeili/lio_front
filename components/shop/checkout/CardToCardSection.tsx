'use client';

import { useState } from 'react';
import { Copy, CopyCheck } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import Attachment from './Attachment';
import type { CardMethodData } from '@/typescript/types/checkout.types';

interface CardToCardSectionProps {
  paymentMethodsData: CardMethodData[];
  onFileSelect: (file: File | undefined) => void;
}

type CopyType = 'card' | 'sheba';

interface CopiedState {
  index: number;
  type: CopyType;
}

export default function CardToCardSection({
  paymentMethodsData,
  onFileSelect,
}: CardToCardSectionProps) {
  const { copy: copyCardNumber } = useCopyToClipboard({
    successMessage: 'شماره کارت کپی شد',
    errorMessage: 'خطا در کپی شماره کارت',
  });

  const { copy: copyShebaNumber } = useCopyToClipboard({
    successMessage: 'شماره شبا کپی شد',
    errorMessage: 'خطا در کپی شماره شبا',
  });

  const [copied, setCopied] = useState<CopiedState | null>(null);

  if (!paymentMethodsData || paymentMethodsData.length === 0) {
    return null;
  }

  const handleCopy = async (
    value: string,
    index: number,
    type: CopyType,
  ) => {
    const rawValue = value.replace(/\s|-/g, '');

    setCopied({ index, type });

    if (type === 'card') {
      await copyCardNumber(rawValue);
    } else {
      await copyShebaNumber(rawValue);
    }

    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  const isCopied = (index: number, type: CopyType) => {
    return copied?.index === index && copied?.type === type;
  };

  return (
    <>
      <span className="block border-b border-primary-3 pb-2 text-body">
        کارت به کارت
      </span>

      <div className="flex flex-col gap-3">
        {paymentMethodsData.map((card, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4"
          >
            {/* شماره کارت */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-2">
                شماره کارت
              </span>

              <div className="flex items-center gap-2">
                <span
                  className="cursor-pointer select-all text-body font-medium leading-none transition-colors active:text-primary-3"
                  dir="ltr"
                  onClick={() =>
                    handleCopy(card.number_card, index, 'card')
                  }
                  title="کپی شماره کارت"
                >
                  {formatCardNumber(card.number_card)}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(card.number_card, index, 'card')
                  }
                  className="shrink-0 rounded-md p-1 transition-colors hover:bg-gray-200"
                  title="کپی شماره کارت"
                  aria-label="کپی شماره کارت"
                >
                  {isCopied(index, 'card') ? (
                    <CopyCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-secondary-2" />
                  )}
                </button>
              </div>
            </div>

            {/* شماره شبا */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-2">
                شماره شبا
              </span>

              <div className="flex items-center gap-2">
                <span
                  className="cursor-pointer select-all text-body font-medium leading-none transition-colors active:text-primary-3"
                  dir="ltr"
                  onClick={() =>
                    handleCopy(card.sheba_card, index, 'sheba')
                  }
                  title="کپی شماره شبا"
                >
                  {formatCardNumber(card.sheba_card)}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(card.sheba_card, index, 'sheba')
                  }
                  className="shrink-0 rounded-md p-1 transition-colors hover:bg-gray-200"
                  title="کپی شماره شبا"
                  aria-label="کپی شماره شبا"
                >
                  {isCopied(index, 'sheba') ? (
                    <CopyCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-secondary-2" />
                  )}
                </button>
              </div>
            </div>

            {/* نام صاحب کارت */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-2">
                نام صاحب کارت
              </span>

              <span className="text-sm font-medium">
                {card.name_card}
              </span>
            </div>

            {/* بانک */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-2">
                بانک
              </span>

              <span className="text-sm font-medium">
                {card.title_card}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Attachment onFileSelect={onFileSelect} />
    </>
  );
}

function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s|-/g, '');

  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
}