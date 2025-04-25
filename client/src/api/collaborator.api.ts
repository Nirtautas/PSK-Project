import { FetchResponse, HTTPMethod } from '@/types/fetch';
import { apiBaseUrl } from '@/constants/api';
import { fetch, getAuthorizedHeaders } from '../utils/fetch';
import { User } from '@/types/types';

export default class CollaboratorApi {
    static async getCollaborators(boardId: number): Promise<FetchResponse<User[]>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/users`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders(),
        });
    }

    static async getUsersByUserName(boardId: number, userName: string): Promise<FetchResponse<User[]>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/collaborators?userName=${encodeURIComponent(userName)}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders(),
        });
    }

    static async linkUserToBoard(boardId: number, userId: number, role: string): Promise<FetchResponse<User[]>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/link/${userId}`,
            method: HTTPMethod.POST,
            headers: getAuthorizedHeaders(),
            body: JSON.stringify({ userRole: role }),
        });
    }
}