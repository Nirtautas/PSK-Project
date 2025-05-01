import { defaultHeaders } from "@/constants/api";
import { FetchParams, FetchResponse } from "@/types/fetch"
import { getCookie } from 'cookies-next/client'

async function fetchWrapper<T = any, U = string>({ url, method, headers, body }: FetchParams): Promise<FetchResponse<T, U>> {
    try {
        console.log('Request URL:', url);
        console.log('Request Method:', method);
        console.log('Request Headers:', headers);
        console.log('Request Body:', body);

        const response = await fetch(url, {
            method,
            body,
            headers
        });

        if (response.ok) {
            try {
                return {
                    result: await response.json()
                };
            } catch (e) {
                return {
                    result: response.statusText as unknown as T
                };
            }
        } else {
            const text = await response.text();
            let data = null;

            try {
                data = text ? JSON.parse(text) : null;
            } catch (e) {
                console.warn("Failed to parse error response JSON:", e);
            }

            return {
                error: data?.error || response.statusText
            };
        }
    } catch (err) {
        console.log((err as Error).message);
        return { error: (err as Error).message as unknown as U };
    }
}

export { fetchWrapper as fetch }

export const getAuthorizedHeaders = () => {
    const token = getCookie('jwtToken')
    return {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`
    }
}

export const encodeDateToUrlString = (date: Date) => encodeURIComponent(date.toLocaleString('lt'))

export const sanitizeData = (data: any) => {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === undefined ? null : value])
    )
}
