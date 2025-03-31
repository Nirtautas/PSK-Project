import { authApiBaseUrl, defaultHeaders } from '@/constants/api'
import { LoginResponse } from '@/types/auth'
import { FetchResponse, HTTPMethod } from '@/types/fetch'
import { fetch } from '@/utils/fetch'

export default class AuthApi {
    static login({ username, password }: { username: string, password: string }): Promise<FetchResponse<LoginResponse>> {
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
}