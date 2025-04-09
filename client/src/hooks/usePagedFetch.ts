import { useEffect, useState } from 'react'

type Args<T> = {
    resolver: () => Promise<any>
    pageNum: number
    pageSize?: number
    delayMs?: number
    deps?: any[]
    resultKey?: string
}

export type PagedResponse<T> = {
    totalCount: number
    pageSize: number
    pageNum: number
    results: T[]
}

const usePagedFetch = <T>({ resolver, pageNum, pageSize = 10, delayMs, deps = [], resultKey = 'boards' }: Args<T>) => {
    const [data, setData] = useState<PagedResponse<T> | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [errorMsg, setErrorMsg] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const raw = await resolver()
                const result = raw.result
                delayMs && await new Promise(resolve => setTimeout(resolve, delayMs))

                const response: PagedResponse<T> = {
                    totalCount: result.totalCount,
                    pageNum,
                    pageSize,
                    results: result[resultKey] || []
                }

                setErrorMsg('')
                setData(response)
            } catch (e: any) {
                setErrorMsg(e.message || 'Something went wrong')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [pageNum, pageSize, delayMs, resultKey, ...deps])

    return {
        data,
        setData,
        isLoading,
        errorMsg
    }
}

export default usePagedFetch
