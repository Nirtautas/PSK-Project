export const publicRoutes = [
    '/login'
]

export const GetPageUrl = {
    login: '/login',
    boards: (pageNum: number) => `/boards?pageNum=${pageNum}`,
    board: (pageNum: number) => `/boards/${pageNum}`
} as const