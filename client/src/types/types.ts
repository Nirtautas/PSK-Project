export type Board = {
    id: number
    title: string
    description: string
    imageURL: string | null
    creationDate: Date
    version: number
    tasks: Task[]
}

export type StatusString = 'Pending' | 'In_Progress' | 'Completed' | 'Archived'

export enum TaskStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    ARCHIVED
}

export type Task = {
    id: number
    boardId: number
    title: string
    taskStatus: TaskStatus
    description: string | null
    creationDate: Date
    deadlineEnd: Date | null
    version: number
    assignedUsers: TaskUser[]
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
    userName: string
    creationDate: Date
    imageURL: string
    email: string
}

export type BoardUser = {
    id: number
    userName: string
    imageURL: string | undefined
    userRole: RoleString
    firstName: string
    lastName: string
    addedAt: Date
}

export type TaskUser = {
    id: number
    userName: string
    imageURL: string
    assignedAt: Date
}

export type Notification = {
    id: number
    boardId: number
    taskId: number
    title: string
    description: string
    sendDate: Date
    type: NotificationType
}

export enum NotificationType {
    INVITATION = 0,
    TASK_CREATED,
    TASK_STATUS_CHANGE,
    TASK_ASSIGNED,
    USER_ADDED_TO_BOARD,
    USER_REMOVED_FROM_BOARD,
    USER_LEFT_BOARD,
}

export type Comment = {
    id: number
    taskId: number
    userId: number
    content: string
    creationDate: Date
    version: number
}