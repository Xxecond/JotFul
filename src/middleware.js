import { NextResponse } from 'next/server'

// Middleware to protect selected page routes by checking for an `access_token` cookie.
// If the cookie is missing the user is redirected to `/login` with the original
// path included as `redirect=` so the app can navigate back after authentication.

export function middleware(req) {
  const { pathname } = req.nextUrl

  // Allow static files, API routes and auth pages to pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next()
  }

  // Check for access_token cookie (fast server-side check)
  const token = req.cookies.get('access_token')?.value
  if (token) return NextResponse.next()

  // Not authenticated: redirect to /login and include original path
  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/login'
  loginUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(loginUrl)
}

// Only apply middleware to routes we want to protect for performance
export const config = {
  matcher: [
    '/create/:path*',
    '/home/:path*',
    '/blog/edit/:path*',
    '/info/:path*',
  ],
}
