export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export type FetchResponse<T, U = string> = {
    error?: U
    result?: T
}

export type FetchParams = {
    url: string,
    method: HTTPMethod,
    headers?: HeadersInit,
    body?: BodyInit
}
