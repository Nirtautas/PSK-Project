import { Paginated } from '@/types/api'
import { FetchResponse } from '@/types/fetch'
import useFetchResponse from './useFetchResponse'

export type UseFetchPagedArgs<T> = {
    resolver: () => Promise<FetchResponse<Paginated<T>>>
    delayMs?: number,
    deps?: any[]
}


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
        pageNumber: data?.pageNumber || null,
        pageCount: data?.pageCount || null,
        pageSize: data?.pageSize || null,
        setData: (newItems: T[]) => setData({ ...data, items: newItems }),
        isLoading,
        errorMsg,
        refetch
    }
}

export default useFetchResponsePaged
