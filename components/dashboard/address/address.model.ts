export interface Address {
    /**
     * شناسه آدرس
     * در حالت Create خالی است و پس از ذخیره توسط API مقدار می‌گیرد.
     */
    id?: string;

    /**
     * مختصات جغرافیایی
     */
    lat?: number;
    lng?: number;

    /**
     * شناسه استان و شهر (payload backend)
     */
    province_id?: number;
    place_id?: number;

    /**
     * نام خانوادگی
     */
    name_family: string;

    /**
     * موقعیت مکانی
     */
    province: string;
    city: string;

    /**
     * جزئیات آدرس
     */
    address: string;


    /**
     * کد پستی
     */
    postalCode: string;

    /**
     * عنوان آدرس
     * مثال:
     * منزل
     * محل کار
     * شرکت
     */
    title: string;

    /**
     * دریافت‌کننده سفارش
     */
    receiverType: "self" | "other";

    /**
     * فقط زمانی مقدار دارد که
     * receiverType === "other"
     */
    receiverName: string;

    receiverPhone: string;
}

/**
 * مدل اولیه فرم آدرس
 */
export const initialAddress: Address = {
    province: "",
    city: "",

    address: "",

    postalCode: "",

    title: "",

    receiverType: "self",

    receiverName: "",
    receiverPhone: "",

    name_family: "",
};