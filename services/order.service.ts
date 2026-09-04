import type { AxiosResponse } from "axios";

import http from "@/services/core/clientService";
import { fetcher } from "@/services/core/SSRService";


const csrPrefixUrl =
    process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT!;

const ssrPrefixUrl =
    process.env.BACKEND_ENDPOINT_SSR!;

// Orders List

export const ordersListAll = (
): Promise<AxiosResponse> => {
    return http.get(
        `${csrPrefixUrl}/profile/orders`
    );
};

export const orderByCode = (
  code: string | number
): Promise<AxiosResponse<any>> => {
  return http.get(
    `${csrPrefixUrl}/profile/orders/${code}`
  );
};

// export const orderByQ = (
//   code: string | number
// ): Promise<AxiosResponse<any>> => {
//   return http.get(
//     `${csrPrefixUrl}/profile/orders?q=${code}` // &search=true
//   );
// };
export const orderByQ = (
    code: string | number,
): Promise<AxiosResponse> => {
    return http.get(
        `${csrPrefixUrl}/profile/orders?q=${code}`,
    );
};

export const ordersList = (
    statusCode: number,
    page: number = 1
): Promise<AxiosResponse> => {
    return http.get(
        `${csrPrefixUrl}/profile/orders?active_tab=${statusCode}&page=${page}`
    );
};

// Order Detail

export const orderDetail = (
    id: string | number
): Promise<AxiosResponse> => {
    return http.get(
        `${csrPrefixUrl}/profile/orders/${id}`
    );
};


// SSR - Orders List

export const ordersListSSR = async (
    statusCode: number,
    page: number = 1
) => {
    return fetcher(
        `${ssrPrefixUrl}/profile/orders?active_tab=${statusCode}&page=${page}`,
        {
            next: {
                revalidate: 60,
            },
        }
    );
};

// SSR - Order Detail

export const orderDetailSSR = async (
    id: string | number
) => {
    return fetcher(
        `${ssrPrefixUrl}/profile/orders/${id}`,
        {
            next: {
                revalidate: 60,
            },
        }
    );
};
