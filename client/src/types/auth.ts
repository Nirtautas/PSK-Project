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

export type ForgotPasswordRequest = {
    email: string
}

export type ForgotPasswordResponse = {
    message: string
}

export type ResetPasswordRequest = {
    email: string,
    resetCode: string,
    newPassword: string
}

export type ResetPasswordResponse = {
    message: string
}

export type ChangePasswordRequest = {
    email: string,
    oldPassword: string,
    newPassword: string
}

export type ChangePasswordResponse = {
    message: string
}