import {Board} from '@/types/types'
import { FetchResponse, HTTPMethod, PagedResponse } from '../types/fetch'
import { apiBaseUrl } from '../constants/api'
import { fetch, getAuthorizedHeaders } from '../utils/fetch'
import TaskApi from './task.api'

export type CreateBoardDto = Omit<Board, 'id' | 'creationDate' | 'tasks' | 'version'>
export type UpdateBoardDto = Omit<Board, 'id' | 'creationDate' | 'tasks'>

export default class BoardApi {
    static async getBoards(pageNumber: number): Promise<FetchResponse<PagedResponse<Board>>> {
        return await fetch({
            url: `${apiBaseUrl}/boards?pageNum=${pageNumber}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
    }

    static async getBoardById(id: number): Promise<FetchResponse<Board>> {
        const boardResponse = await fetch({
            url: `${apiBaseUrl}/boards/${id}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })

        const boardData = boardResponse.result

        const taskResponse = await TaskApi.getTasks(id)
        const tasks = taskResponse.result ?? []

        boardResponse.result.tasks = tasks

        return {
            ...boardResponse,
            result: {
                ...boardData,
                tasks
            }
        }
    }

    static async createBoard(board: CreateBoardDto): Promise<FetchResponse<Board>> {
        return await fetch({
            url: `${apiBaseUrl}/boards`,
            method: HTTPMethod.POST,
            headers: getAuthorizedHeaders(),
            body: JSON.stringify(board)
        })
    }

    static async updateBoard(id: number, board: UpdateBoardDto): Promise<FetchResponse<Board>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${id}`,
            method: HTTPMethod.PUT,
            headers: getAuthorizedHeaders(),
            body: JSON.stringify(board)
        })
    }

    static async deleteBoard(id: number): Promise<FetchResponse<any>> {
        return await fetch({
            url: `${apiBaseUrl}/boards/${id}`,
            method: HTTPMethod.DELETE,
            headers: getAuthorizedHeaders()
        })
    }
}
