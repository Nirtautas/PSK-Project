export type LoginResponse = {
    id: number
    userName: string
    jwtToken: string
}

export type RegisterRequest = {
    firstName: string
    lastName: string
    userName: string
    email: string
    password: string
}

export type RegisterResponse = {
    id: number
    firstName: string
    lastName: string
    userName: string
    email: string
    password: string
}