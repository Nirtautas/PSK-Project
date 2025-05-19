import {Board} from '@/types/types'
import { FetchResponse, HTTPMethod } from '../types/fetch'
import { apiBaseUrl } from '../constants/api'
import { fetch, getAuthorizedHeaders } from '../utils/fetch'
import TaskApi from './task.api'
import { Paginated } from '@/types/api'

export type CreateBoardDto = Pick<Board, 'title' | 'description'> & { imageName: string }
export type UpdateBoardDto = Pick<Board, 'title' | 'description' | 'version'> & { imageName: string }
export type BoardWithTotalCount = { boards: Board[], totalCount: number, pageSize: number, pageNumber: number }

export default class BoardApi {
    static async getBoards(pageNumber: number): Promise<FetchResponse<Paginated<Board>>> {
        // FIXME: fix when actual backend pagination is implemented
        const response = await fetch<BoardWithTotalCount>({
            url: `${apiBaseUrl}/boards?pageNum=${pageNumber}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
        if (response.error) {
            return response as unknown as FetchResponse<Paginated<Board>>
        }
        const result = response.result!
        return {
            result: {
                pageNumber: result.pageNumber,
                pageSize: result.pageSize,
                items: (result as any).boards,
                pageCount: Math.ceil(result.totalCount / result.pageSize),
            }
        }
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
