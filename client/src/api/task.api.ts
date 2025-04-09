import { Board, Task, Comment } from '@/types/types'
import { FetchResponse, HTTPMethod } from '@/types/fetch';
import { apiBaseUrl } from '@/constants/api';
import { fetch, getAuthorizedHeaders } from '../utils/fetch'

export default class TaskApi {
    static async getTasks(boardId: number): Promise<FetchResponse<Task[]>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/tasks`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
    }

    public static async update(task: Task): Promise<Task> {
        return task
    }

    public static async create(task: Omit<Task, 'id'>, boardId: Board['id']): Promise<Task> {
        return {
            ...task,
            id: 1
        }
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
