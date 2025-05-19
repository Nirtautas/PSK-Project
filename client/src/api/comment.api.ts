import { apiBaseUrl } from "@/constants/api";
import { Paginated } from '@/types/api'
import { FetchResponse, HTTPMethod } from "@/types/fetch";
import { Board, Task, Comment } from "@/types/types";
import { getAuthorizedHeaders, fetch } from "@/utils/fetch";

export default class CommentApi {

    public static async getAll(boardId: Board['id'], taskId: Task['id'], pageNum: Number, pageSize: Number): Promise<FetchResponse<Paginated<Comment>>> {
        const response = await fetch<Paginated<Comment>>({
            url: `${apiBaseUrl}/boards/${boardId}/tasks/${taskId}/comments?pageNum=${pageNum}&pageSize=${pageSize}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders() as HeadersInit,
        });
            
        if (!response.result) {
            return response
        }
        const result = response.result!
        return {
            result: {
                pageNumber: result.pageNumber,
                pageSize: result.pageSize,
                pageCount: result.pageCount,
                items: result.items
            }
        }
    }

    public static async create(boardId: Board['id'], commentText: String, taskId: Task['id']): Promise<FetchResponse<Comment>> {
        return fetch({
            url: `${apiBaseUrl}/boards/${boardId}/tasks/${taskId}/comments`,
            method: HTTPMethod.POST,
            headers: getAuthorizedHeaders() as HeadersInit,
            body: JSON.stringify({
                Content: commentText,
            })
        });
    }

    public static async delete(boardId: Board['id'], taskId: Task['id'], commentId: Comment['id']): Promise<FetchResponse<void>> {
        return fetch({
            url: `${apiBaseUrl}/boards/${boardId}/tasks/${taskId}/comments/${commentId}`,
            method: HTTPMethod.DELETE,
            headers: getAuthorizedHeaders() as HeadersInit
        });
    }
    
    public static async update(boardId: Board['id'], taskId: Task['id'], commentId: Comment['id'], commentText: String, version: number): Promise<FetchResponse<Comment>> {
        return fetch({
            url: `${apiBaseUrl}/boards/${boardId}/tasks/${taskId}/comments/${commentId}`,
            method: HTTPMethod.PUT,
            headers: getAuthorizedHeaders() as HeadersInit,
            body: JSON.stringify({
                Content: commentText,
                Version: version
            })
        });
    }
}