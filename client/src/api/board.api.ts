import {Board} from '@/types/types'
import TaskApi from '@/api/task.api'

export type CreateBoardDto = Omit<Board, 'id' | 'imgUrl'> & {
    imageFile?: File
}

export default class BoardApi {
    static async getBoards(): Promise<Board[]> {
        return [
            {
                name: 'test',
                id: 1,
                description: 'test description',
                imgUrl: 'https://preview.colorkit.co/color/ff0000.png?static=true',
                tasks: null
            },
            {
                name: 'test',
                id: 2,
                description: 'test description',
                imgUrl: 'https://preview.colorkit.co/color/ff0000.png?static=true',
                tasks: null
            },
            {
                name: 'test',
                id: 3,
                description: 'test description',
                imgUrl: 'https://preview.colorkit.co/color/ff0000.png?static=true',
                tasks: null
            },
            {
                name: 'test',
                id: 4,
                description: 'test description',
                imgUrl: 'https://preview.colorkit.co/color/ff0000.png?static=true',
                tasks: null
            }
        ] satisfies Board[]
    }

    static async createBoard(board: CreateBoardDto): Promise<Board> {
        //TODO: im guessing that tasks should be null on creation too
        return {
            ...board,
            id: 1,
            imgUrl: null
        }
    }

    static async getBoardById(id: number): Promise<Board> {
        return {
            name: 'test',
            id,
            description: 'test description',
            imgUrl: 'https://preview.colorkit.co/color/ff0000.png?static=true',
            tasks: (await TaskApi.getTasks(id)).items
        }
    }
}
