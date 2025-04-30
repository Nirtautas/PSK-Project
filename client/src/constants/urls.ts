
export const getPageUrl = {
    home: () => '/',
    boards: () => '/boards',
    board: (id: number) => `/boards/${id}`,
    settings: () => '/settings',
    login: () => '/login',
    register: () => '/register',
    logout: () => '/logout'
}

export const pathnames = {
    boards: '/boards'
}
