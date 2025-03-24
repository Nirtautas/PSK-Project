

export type Board = {
    id: number
    name: string
    description: string
    imgUrl: string
    tasks?: Task[]
}

export type Task = {
    id: number
    title: string
    status: string
}
export const sortTasksByTitle = (a: Task, b: Task) => b.title.localeCompare(a.title)

export type User = {
    id: number
    name: string
}

export type Notification = {
    id: number
    title: string
    description: string
    date: Date
}
