import { FetchResponse, HTTPMethod } from "@/types/fetch"
import { BoardUser } from "@/types/types"
import { fetch, getAuthorizedHeaders } from '../utils/fetch'
import { apiBaseUrl } from "@/constants/api"

export default class TaskOnUserApi {
    static async getTaskUsers(boardId: number, taskId: number): Promise<FetchResponse<BoardUser[]>> {
        return fetch ({
            url: `${apiBaseUrl}/boards/${boardId}/tasks/${taskId}/users`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
    }

    static async linkTaskUser(boardId: number, taskId: number, userIds: number[]): Promise<FetchResponse<any>> {
        const body = userIds.map(id => ({ userId: id }));
        
        return fetch ({
            url: `${apiBaseUrl}/boards/${boardId}/tasks/${taskId}/users/link`,
            method: HTTPMethod.POST,
            headers: getAuthorizedHeaders(),
            body: JSON.stringify(body)
        })
    }
}