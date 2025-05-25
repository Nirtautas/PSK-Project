export const publicRoutes = [
    '/login',
    '/forgot-password',
    '/reset-password',
    '/gifs'
]

export const GetPageUrl = {
    login: '/login',
    boards: (pageNum: number) => `/boards?pageNum=${pageNum}`,
    board: (pageNum: number) => `/boards/${pageNum}`,
    changePassword: (email: string) => `/users/change-password?email=${email}`,
    users: '/users'
} as const