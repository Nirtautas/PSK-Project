import {useEffect, useState} from 'react'


export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

type Args<T> = {
    resolver: () => Promise<T>
    delayMs?: number
}

const useFetch = <T>({ resolver, delayMs }: Args<T>) => {
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
    }, [])

    return {
        data,
        setData,
        isLoading,
        errorMsg
    }
}

export default useFetch
