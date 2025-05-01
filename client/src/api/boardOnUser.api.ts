import { Board, Role, RoleString, BoardUser } from "@/types/types"
import { FetchResponse, HTTPMethod } from '@/types/fetch';
import { apiBaseUrl } from '@/constants/api';
import { fetch, getAuthorizedHeaders } from '../utils/fetch'

export default class BoardOnUserApi {
    static async getUserRole(boardId: number, userId: number | null): Promise<FetchResponse<Role>> {
        if (userId === null) {
            return { result: Role.VIEWER }
        }
        return fetch({
            url: `${apiBaseUrl}/boards/${boardId}/link/${userId}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
    }

    static async getBoardUsers(boardId: number): Promise<FetchResponse<BoardUser[]>> {
        return fetch ({
            url: `${apiBaseUrl}/boards/${boardId}/users`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
    }
}