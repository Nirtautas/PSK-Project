import { authApiBaseUrl, defaultHeaders } from '@/constants/api'
import { ForgotPasswordRequest, ForgotPasswordResponse, LoginResponse, RegisterRequest, RegisterResponse, ResetPasswordRequest, ResetPasswordResponse } from '@/types/auth'
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

    static async forgotPassword(request: ForgotPasswordRequest): Promise<FetchResponse<ForgotPasswordResponse>> {
        return fetch({
            url: `${authApiBaseUrl}/forgot-password`,
            method: HTTPMethod.POST,
            headers: defaultHeaders,
            body: JSON.stringify(request)
        })
    }

    static async resetPassword(request: ResetPasswordRequest): Promise<FetchResponse<ResetPasswordResponse>> {
        return fetch({
            url: `${authApiBaseUrl}/reset-password`,
            method: HTTPMethod.POST,
            headers: defaultHeaders,
            body: JSON.stringify(request)
        })
    }
}
