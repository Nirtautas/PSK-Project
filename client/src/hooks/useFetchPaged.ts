import { Paginated } from '@/types/api'
import { FetchResponse } from '@/types/fetch'
import useFetchResponse from './useFetchResponse'

export type UseFetchPagedArgs<T> = {
    resolver: () => Promise<FetchResponse<Paginated<T>>>
    delayMs?: number,
    deps?: any[]
}

// Remember to check if 'isLoading' and 'errorMsg' before using other properties as they may be undefined or null
const useFetchResponsePaged = <T>(args: UseFetchPagedArgs<T>) => {
    const {
        data,
        setData,
        isLoading,
        errorMsg,
        refetch
    } = useFetchResponse(args)

    return {
        data: data?.items || null,
        pageNumber: data?.pageNumber as unknown as number,
        pageCount: data?.pageCount as unknown as number,
        pageSize: data?.pageSize as unknown as number,
        setData: (newItems: T[]) => setData({ ...data, items: newItems }),
        isLoading,
        errorMsg,
        refetch
    }
}

export default useFetchResponsePaged
