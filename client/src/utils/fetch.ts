import { defaultHeaders } from "@/constants/api"
import { FetchParams, FetchResponse } from "@/types/fetch"
import { getCookie } from 'cookies-next/client'

async function fetchWrapper<T = any, U = string>({ url, method, headers, body }: FetchParams): Promise<FetchResponse<T, U>> {
    try {
        const response = await fetch(url, {
            method,
            body,
            headers
        })

        if (response.ok) {
            const body = await response.text()
            try {
                return {
                    result: JSON.parse(body)
                }
            } catch (e) {
                return {
                    // @ts-ignore
                    result: body || 'No Content'
                }
            }
        } else {
            const responseJson = await response.json()
            return {
                error: responseJson.details || responseJson.title || response.statusText
            }
        }
    } catch (err) {
        console.log((err as Error).message)
        return { error: (err as Error).message as unknown as U }
    }
}

export { fetchWrapper as fetch }

export const getAuthorizedHeaders = (type?: 'multipart/form-data') => {
    let headers = defaultHeaders
    if (type === 'multipart/form-data') {
        headers = {}
    }
    const token = getCookie('jwtToken')
    return {
        ...headers,
        Authorization: `Bearer ${token}`
    }
}

export const encodeDateToUrlString = (date: Date) => encodeURIComponent(date.toLocaleString('lt'))

export const sanitizeData = (data: any) => {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === undefined ? null : value])
    )
}
