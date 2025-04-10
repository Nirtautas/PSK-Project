import { Board, Task, Comment } from '@/types/types'
import { FetchResponse, HTTPMethod } from '@/types/fetch';
import { apiBaseUrl } from '@/constants/api';
import { fetch, getAuthorizedHeaders } from '../utils/fetch'

export type CreateTaskDto = Omit<Task, 'id' | 'creationDate' | 'boardId' | 'assignedUsers'>

export default class TaskApi {
    static async getTasks(boardId: number): Promise<FetchResponse<Task[]>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/tasks`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
    }

    public static async update(boardId: number, boardTaskId: number, task: CreateTaskDto): Promise<FetchResponse<Task>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/tasks/${boardTaskId}`,
            method: HTTPMethod.PUT,
            headers: getAuthorizedHeaders(),
            body: JSON.stringify(task)
        })
    }

    static async create(task: CreateTaskDto, boardId: number): Promise<FetchResponse<Task>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/tasks`,
            method: HTTPMethod.POST,
            headers: getAuthorizedHeaders(),
            body: JSON.stringify(task)
        })
    }

    //TODO: probably needs to be paginated and taken out to a seperate API file
    public static async getCommentsByTask(taskId: Task['id']): Promise<Comment[]> {
        return [
            {
                id: 1,
                text: 'test',
                createdAt: new Date(),
                createdBy: {
                    id: 1,
                    userRole: 'Owner',
                    firstName: 'Jonas',
                    lastName: 'Jonaitis'
                }
            },
            {
                id: 2,
                text: 'test',
                createdAt: new Date(),
                createdBy: {
                    id: 1,
                    userRole: 'Owner',
                    firstName: 'Petras',
                    lastName: 'Jonaitis'
                }
            },
            {
                id: 3,
                text: 'test',
                createdAt: new Date(),
                createdBy: {
                    id: 1,
                    userRole: 'Owner',
                    firstName: 'Eugenijus',
                    lastName: 'Jonaitis'
                }
            }
        ];
    }
}
