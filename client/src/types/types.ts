

export type Board = {
    id: number
    title: string
    description: string
    imageURL: string | null
    creationDate: Date 
    tasks: Task[]
}

export type StatusString = 'Pending' | 'In_Progress' | 'Completed'

export enum TaskStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED
}

export type Task = {
    id: number
    boardId: number
    title: string
    taskStatus: TaskStatus
    description: string | null
    creationDate: Date
    deadlineEnd: Date | null
    //TODO: make assigned users get passed by id (number[]) instead of string[]
    assignedUsers: string[] | string | null
}
export const sortTasksByTitle = (a: Task, b: Task) => b.title.localeCompare(a.title)

export type RoleString = 'Owner' | 'Editor' | 'Viewer' | null

export enum Role {
    OWNER,
    EDITOR,
    VIEWER
}

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
    taskId: number
    userId: number
    content: string
    creationDate: Date
}

export type BoardOnUser = {
    boardId: number
    userId: number
    addedAt: Date
    userRole: RoleString
}