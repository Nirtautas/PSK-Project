import { FetchResponse, HTTPMethod } from '@/types/fetch';
import { apiBaseUrl } from '@/constants/api';
import { fetch, getAuthorizedHeaders } from '../utils/fetch';
import { BoardUser } from '@/types/types';

export default class CollaboratorApi {
    static async getCollaborators(boardId: number): Promise<FetchResponse<BoardUser[]>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/users`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders(),
        });
    }

    static async getUsersByUserName(boardId: number, userName: string): Promise<FetchResponse<BoardUser[]>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/collaborators?userName=${encodeURIComponent(userName)}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders(),
        });
    }

    // static async linkUserToBoard(boardId: number, userId: number, role: string): Promise<FetchResponse<BoardUser[]>> {
    //     return await fetch({
    //         url: `${apiBaseUrl}/boards/${boardId}/link/${userId}`,
    //         method: HTTPMethod.POST,
    //         headers: getAuthorizedHeaders(),
    //         body: JSON.stringify({ userRole: role }),
    //     });
    // }

    static async inviteUserToBoard(boardId: number, userId: number, role: string): Promise<FetchResponse<any>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/invite`,
            method: HTTPMethod.POST,
            headers: getAuthorizedHeaders(),
            body: JSON.stringify({ userId, role }),
        });
    }

    static async updateUserRole(boardId: number, userId: number, newRole: string): Promise<FetchResponse<BoardUser>> {
        const patchData = [
            {
                op: 'replace', 
                path: '/userRole', 
                value: newRole 
            }
        ];

        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/link/${userId}`,
            method: HTTPMethod.PATCH,
            headers: getAuthorizedHeaders(),
            body: JSON.stringify(patchData), 
        });
    }

    static async transferOwnership(boardId: number, newOwnerId: number): Promise<FetchResponse<any>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/collaborators/${newOwnerId}`,
            method: HTTPMethod.POST,
            headers: getAuthorizedHeaders(),
        });
    }
}