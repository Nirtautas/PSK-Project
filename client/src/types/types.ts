

export type Board = {
    id: number
    title: string
    description: string
    imageURL: string | null
    creationDate: Date 
}

export type StatusString = 'Waiting' | 'In progress' | 'Done'

export type Task = {
    id: number
    boardId: number
    title: string
    status: StatusString
    description: string | null
    creationDate: Date
    deadline: Date | null
    //TODO: make assigned users get passed by id (number[]) instead of string[]
    assignedUsers: string[] | string | null
}
export const sortTasksByTitle = (a: Task, b: Task) => b.title.localeCompare(a.title)

export type RoleString = 'Owner' | 'Editor' | 'Viewer'
export type User = {
    id: number
    userRole: RoleString
    firstName: string
    lastName: string
}

export type Notification = {
    id: number
    title: string
    description: string
    date: Date
}

export type Comment = {
    id: number
    text: string
    createdAt: Date
    createdBy: User
}