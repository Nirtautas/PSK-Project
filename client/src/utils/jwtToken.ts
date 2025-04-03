import { jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

export const verifyJwtToken = async (request: NextRequest) => {
    try {
        const token = request.cookies.get('jwtToken')!.value
        const jwtSecretKey = process.env.JWT_SECRET_KEY

        if (!jwtSecretKey) throw new Error('JWT_SECRET_KEY is not defined')

        const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecretKey))
        return { isAuthenticated: true, payload }
    } catch (e: any) {
        return { isAuthenticated: false, errorMsg: e.message }
    }
}