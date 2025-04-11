import { apiBaseUrl, defaultHeaders } from "@/constants/api";
import { HTTPMethod } from "@/types/fetch";
import { Board, Task, Comment } from "@/types/types";
import { getAuthorizedHeaders } from "@/utils/fetch";

export default class CommentApi {

    public static async getAllBoardTaskComments(boardId: Board['id'], taskId: Task['id']): Promise<Comment[]> {
        const comments = await fetch(`${apiBaseUrl}/boards/${boardId}/tasks/${taskId}/comments`, {
            method: HTTPMethod.POST,
            headers: getAuthorizedHeaders() as HeadersInit,
            body: JSON.stringify({
                boardId: boardId,
                taskId: taskId
            })
        }).then(response => response.json());
        console.log(comments);
        return [];
    }

    public static async createComment(boardId: Board['id'], commentText: String, taskId: Task['id']): Promise<Comment> {
        return fetch(`${apiBaseUrl}/boards/${boardId}/tasks/${taskId}/comments`, {
            method: HTTPMethod.POST,
            headers: getAuthorizedHeaders() as HeadersInit,
            body: JSON.stringify({
                Content: commentText,
            })
        }).then(response => response.json());
    }

    public static async deleteComment(boardId: Board['id'], taskId: Task['id'], commentId: Comment['id']): Promise<void> {
        return fetch(`${apiBaseUrl}/boards/${boardId}/tasks/${taskId}/comments/${commentId}`, {
            method: HTTPMethod.DELETE,
            headers: getAuthorizedHeaders() as HeadersInit
        }).then(response => response.json());
    }
}