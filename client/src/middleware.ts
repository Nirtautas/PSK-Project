import { NextRequest, NextResponse } from 'next/server'

import { verifyJwtToken } from './utils/jwtToken'
import { publicRoutes, GetPageUrl } from './constants/route'

const isPublicRoute = (path: string) => !!publicRoutes.find((publicPath) => path.startsWith(publicPath))

export async function middleware(request: NextRequest) {

    const currentRoute = request.nextUrl.pathname

    if (currentRoute.startsWith('/_next')) {
        return NextResponse.next()
    }

    if (currentRoute.startsWith('/register')) {
        return NextResponse.next()
    }

    if (process.env.REQUIRE_AUTH === 'NO') {
        return NextResponse.next()
    }

    const { isAuthenticated, payload } = await verifyJwtToken(request)

    if (isPublicRoute(currentRoute) && !isAuthenticated) {
        return NextResponse.next()
    }

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}