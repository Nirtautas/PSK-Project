import { authApiBaseUrl, defaultHeaders } from '@/constants/api'
import { LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth'
import { FetchResponse, HTTPMethod } from '@/types/fetch'
import { fetch } from '@/utils/fetch'

export default class AuthApi {
    static login({ username, password }: { username: string, password: string }): Promise<FetchResponse<LoginResponse, string>> {
        return fetch({
            url: `${authApiBaseUrl}/login`,
            method: HTTPMethod.POST,
            headers: defaultHeaders,
            body: JSON.stringify({
                userName: username,
                password
            })
        })
    }

    static register(request: RegisterRequest): Promise<FetchResponse<RegisterResponse, string[]>> {
        return fetch({
            url: `${authApiBaseUrl}/register`,
            method: HTTPMethod.POST,
            headers: defaultHeaders,
            body: JSON.stringify(request)
        })
    }
}