import {useEffect, useState} from 'react'


enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

type Props<T> = {
    resolver: () => Promise<T>
}

const useFetch = <T>({ resolver }: Props<T>) => {
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
