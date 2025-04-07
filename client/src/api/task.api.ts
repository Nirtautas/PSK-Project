import { Board, Task, Comment } from '@/types/types'
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
                    status: 'Waiting',
                    description: null,
                    deadline: null,
                    assignedUsers: "Jonas"
                },
                {
                    id: 2,
                    title: 'Task 2',
                    status: 'Waiting',
                    description: null,
                    deadline: null,
                    assignedUsers: ["Jonas", "Petras"]
                },
                {
                    id: 3,
                    title: 'Task 3',
                    status: 'Waiting',
                    description: null,
                    deadline: null,
                    assignedUsers: null
                },
                {
                    id: 4,
                    title: 'Task 4',
                    status: 'Waiting',
                    description: null,
                    deadline: null,
                    assignedUsers: null
                }
            ]
        }
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
