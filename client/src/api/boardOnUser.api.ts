import { Board, BoardOnUser } from "@/types/types"
import { FetchResponse, HTTPMethod } from '@/types/fetch';
import { apiBaseUrl } from '@/constants/api';
import { fetch, getAuthorizedHeaders } from '../utils/fetch'

export default class BoardOnUserApi {
    static async getBoardOnUserData(boardId: number, userId: number): Promise<FetchResponse<BoardOnUser>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/link/${userId}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
    }
}