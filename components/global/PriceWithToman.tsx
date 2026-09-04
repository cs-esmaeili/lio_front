import CurrencyLabel from "./Cards/CurrencyLabel";

interface PriceWithTomanProps {
    price: number;
    priceClassName?: string;        // optional class for the price number
    tomanClassName?: string;   // optional class for the Toman component
}

export default function PriceWithToman({ price, priceClassName = '', tomanClassName = '' }: PriceWithTomanProps) {
    return (
        <div className="flex flex-row justify-end items-start gap-1">
            <div className={`text-secondary-1 ${priceClassName || ''}`}>{price.toLocaleString()}</div>
            <CurrencyLabel className={`text-secondary-2 ${tomanClassName || ''}`} />
        </div>

    );
}