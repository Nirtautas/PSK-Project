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
                    id: 1,
                    title: 'Task 1',
                    status: 'waiting'
                },
                {
                    id: 2,
                    title: 'Task 2',
                    status: 'waiting'
                },
                {
                    id: 3,
                    title: 'Task 3',
                    status: 'waiting'
                },
                {
                    id: 4,
                    title: 'Task 4',
                    status: 'waiting'
                }
            ]
        }
    }

    public static async update(task: Task): Promise<Task> {
        return task
    }

    public static async create(task: Omit<Task, 'id'>): Promise<Task> {
        return {
            ...task,
            id: 1
        }
    }
}
