import { Board, Task } from '@/types/types'
import { Paginated } from '@/types/api'

export default class TaskApi {
    public static async getTasks(boardId: Board['id']): Promise<Paginated<Task>> {
        return {
            pageNumber: 1,
            pageCount: 123,
            pageSize: 10,
            items: [
                {
                    id: 123,
                    title: 'Task 1',
                },
                {
                    id: 123,
                    title: 'Task 1',
                },
                {
                    id: 123,
                    title: 'Task 1',
                },
                {
                    id: 123,
                    title: 'Task 1',
                }
            ]
        }
    }
}
