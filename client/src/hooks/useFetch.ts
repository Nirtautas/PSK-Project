import {useEffect, useState} from 'react'


export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

type Args<T> = {
    resolver: () => Promise<T>
}

const useFetch = <T>({ resolver }: Args<T>) => {
    // TODO: implement error handling
    const [data, setData] = useState<T>(null as T)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [errorMsg, setErrorMsg] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            const response = await resolver()
            setIsLoading(false)
            setErrorMsg('')
            setData(response)
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
