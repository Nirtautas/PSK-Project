

export type Board = {
    id: number
    name: string
    description: string
    imgUrl: string
}

export type Task = {
    id: number
    title: string
}

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
