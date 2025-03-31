export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export type FetchResponse<T> = {
    error?: string
    result?: T
}

export type FetchParams = {
    url: string,
    method: HTTPMethod,
    headers?: HeadersInit,
    body?: BodyInit
}

export type PagedResponse<T> = {
    totalCount: number,
    pageSize: number,
    pageNum: number,
    results: T[]
}