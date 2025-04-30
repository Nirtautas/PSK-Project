import { Board, Task, Comment } from '@/types/types'
import { FetchResponse, HTTPMethod } from '@/types/fetch';
import { apiBaseUrl } from '@/constants/api';
import { fetch, getAuthorizedHeaders } from '../utils/fetch'
import TaskOnUserApi from './taskOnUser.api'

export type CreateTaskDto = Omit<Task, 'id' | 'creationDate' | 'boardId' | 'assignedUsers'>

export default class TaskApi {
    static async getTasks(boardId: number): Promise<FetchResponse<Task[]>> {
        const tasksResponse = await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/tasks`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
    
        const tasks = tasksResponse.result ?? []
    
        const tasksWithUsers = await Promise.all(
            tasks.map(async (task: Task) => {
                const usersResponse = await TaskOnUserApi.getTaskUsers(boardId, task.id)
                const users = usersResponse.result ?? []
                return {
                    ...task,
                    assignedUsers: users
                }
            })
        )
    
        return {
            ...tasksResponse,
            result: tasksWithUsers
        }
    }

    static async getTaskById(boardId: number, taskId: number): Promise<FetchResponse<Task>> {
        const taskResponse = await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/tasks/${taskId}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })

        const taskData = taskResponse.result

        const usersResponse = await TaskOnUserApi.getTaskUsers(boardId, taskId)
        const users = usersResponse.result ?? []

        taskResponse.result.assignedUsers = users

        return {
            ...taskResponse,
            result: {
                ...taskData,
                users
            }
        }
    }

    public static async update(boardId: number, boardTaskId: number, task: UpdateTaskDto): Promise<FetchResponse<Task>> {
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

    static async delete(boardId: number, taskId: number): Promise<FetchResponse<any>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${boardId}/tasks/${taskId}`,
            method: HTTPMethod.DELETE,
            headers: getAuthorizedHeaders()
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
                },
                version: null
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
                },
                version: null
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
                },
                version: null
            }
        ]
    }
}
