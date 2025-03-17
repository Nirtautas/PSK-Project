import {Board} from '@/types/types'

export default class BoardApi {
    static async getBoards(): Promise<Board[]> {
        return [
            {
                name: 'test',
                id: 1,
                description: 'test description',
                imgUrl: 'https://preview.colorkit.co/color/ff0000.png?static=true'
            },
            {
                name: 'test',
                id: 2,
                description: 'test description',
                imgUrl: 'https://preview.colorkit.co/color/ff0000.png?static=true'
            },
            {
                name: 'test',
                id: 3,
                description: 'test description',
                imgUrl: 'https://preview.colorkit.co/color/ff0000.png?static=true'
            },
            {
                name: 'test',
                id: 4,
                description: 'test description',
                imgUrl: 'https://preview.colorkit.co/color/ff0000.png?static=true'
            }
        ] satisfies Board[]
    }
}
