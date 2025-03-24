import {useEffect, useState} from 'react'


export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

type Args<T> = {
    resolver: () => Promise<T>
    delayMs?: number,
    deps?: any[]

}

const useFetch = <T>({ resolver, delayMs, deps = [] }: Args<T>) => {
    // TODO: implement error handling
    const [data, setData] = useState<T>(null as T)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [errorMsg, setErrorMsg] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await resolver()
                delayMs && await new Promise((resolve) => setTimeout(resolve, delayMs))
                setErrorMsg('')
                setData(response)
            } catch (e: any) {
                setErrorMsg(e.message || 'Something went wrong')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [delayMs, ...deps])

    return {
        data,
        setData,
        isLoading,
        errorMsg
    }
}

export default useFetch
