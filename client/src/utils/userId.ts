'use client'

export const getUserId = () => {
    if (typeof window !== "undefined") {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User Id not found')
            return parseInt(userId)
    }
}

export const setUserId = (id: number) => {
    localStorage.setItem('userId', id.toString())
}

export const removeUserId = () => localStorage.removeItem('userId')