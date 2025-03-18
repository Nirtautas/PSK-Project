
export type Paginated<T> = {
    items: T[]
    pageNumber: number
    pageCount: number
    pageSize: number
}
