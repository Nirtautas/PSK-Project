import { Notification } from '@/types/types'
import { FetchResponse, HTTPMethod } from '@/types/fetch'
import { fetch, getAuthorizedHeaders } from '@/utils/fetch'
import { apiBaseUrl } from '@/constants/api'

export default class NotificationApi {
    public static async getAll(): Promise<FetchResponse<Notification[]>> {
        return fetch<Notification[]>({
            method: HTTPMethod.GET,
            url: `${apiBaseUrl}/notifications`,
            headers: getAuthorizedHeaders()
        })
    }

    public static async acceptInvitation(notificationId: Notification['id']) {
        return fetch({
            method: HTTPMethod.POST,
            url: `${apiBaseUrl}/notifications/${notificationId}/accept`,
            headers: getAuthorizedHeaders()
        })
    }

    public static async declineInvitation(notificationId: Notification['id']) {
        return fetch({
            method: HTTPMethod.DELETE,
            url: `${apiBaseUrl}/notifications/${notificationId}`,
            headers: getAuthorizedHeaders()
        })
    }

    public static async deleteAll() {
        return fetch({
            method: HTTPMethod.DELETE,
            url: `${apiBaseUrl}/notifications`,
            headers: getAuthorizedHeaders()
        })
    }
}
