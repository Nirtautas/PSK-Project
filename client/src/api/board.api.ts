import {Board} from '@/types/types'
import TaskApi from '@/api/task.api'
import { FetchResponse, HTTPMethod, PagedResponse } from '../types/fetch'
import { apiBaseUrl } from '../constants/api'
import { fetch, getAuthorizedHeaders } from '../utils/fetch'

export type CreateBoardDto = Omit<Board, 'id' | 'creationDate' | 'tasks' | 'version'| 'collaborators'>
export type UpdateBoardDto = Omit<Board, 'id' | 'creationDate' | 'tasks'| 'collaborators'>

export default class BoardApi {
    static async getBoards(pageNumber: number): Promise<FetchResponse<PagedResponse<Board>>> {
        return await fetch({
            url: `${apiBaseUrl}/boards?pageNum=${pageNumber}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
    }

    static async createBoard(board: CreateBoardDto): Promise<FetchResponse<Board>> {
        return await fetch({
            url: `${apiBaseUrl}/boards`,
            method: HTTPMethod.POST,
            headers: getAuthorizedHeaders(),
            body: JSON.stringify(board)
        })
    }

    static async getBoardById(id: number): Promise<Board> {
        return {
            title: 'test',
            id,
            description: 'test description',
            imageURL: 'https://preview.colorkit.co/color/ff0000.png?static=true',
            creationDate: new Date(Date.now()),
            tasks: (await TaskApi.getTasks(id)).result ?? []
        }
    }
}
