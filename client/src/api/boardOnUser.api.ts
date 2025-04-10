import { Board, BoardOnUser, Role, RoleString } from "@/types/types"
import { FetchResponse, HTTPMethod } from '@/types/fetch';
import { apiBaseUrl } from '@/constants/api';
import { fetch, getAuthorizedHeaders } from '../utils/fetch'

export default class BoardOnUserApi {
    static async getUserRole(boardId: number, userId: number | null): Promise<FetchResponse<Role | null>> {
        
        if (userId === null)
            return { result: null }

        const userData = await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/link/${userId}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })

        if (!userData.result) {
            return userData
        }
        
        return { result: userData.result.userRole }
    }
}