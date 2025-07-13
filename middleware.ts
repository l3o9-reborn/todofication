// middleware.ts  (Edge-safe; no Prisma, no next/headers)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = '__session'

// Public files and auth routes
const PUBLIC_PATHS = ['/_next', '/public', '/auth', '/verify']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip public routes
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Simple presence check: does the cookie exist?
  if (!req.cookies.has(COOKIE_NAME)) {
    const login = req.nextUrl.clone()
    login.pathname = '/auth/magic-link'
    login.searchParams.set('next', pathname)   // optional: return path
    return NextResponse.redirect(login)
  }

  return NextResponse.next()
}

/** Protect everything under /dashboard and /account */
export const config = {
  matcher: ['/'],
}
