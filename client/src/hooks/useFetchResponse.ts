import { FetchResponse } from '@/types/fetch'
import {useEffect, useState} from 'react'


type Args<T> = {
    resolver: () => Promise<FetchResponse<T>>
    delayMs?: number
    deps?: any[]
    fallbackValue?: T
}

const useFetchResponse = <T>({ resolver, delayMs, deps = [], fallbackValue }: Args<T>) => {
    const [data, setData] = useState<T>(null as T)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [errorMsg, setErrorMsg] = useState<string>('')



    const fetchData = async () => {
        const response = await resolver()
        if (!response.result) {
            if (fallbackValue !== undefined) {
                setData(fallbackValue)
                setIsLoading(false)
                setErrorMsg('')
                return
            }
            setErrorMsg(response.error || 'Something went wrong')
            setIsLoading(false)
            return
        }
        delayMs && await new Promise((resolve) => setTimeout(resolve, delayMs))
        setErrorMsg('')
        setData(response.result)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [delayMs, ...deps])

    return {
        data,
        setData,
        isLoading,
        errorMsg,
        refetch: fetchData
    }
}

export default useFetchResponse
