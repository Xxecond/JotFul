import { NextResponse } from 'next/server'

export function middleware(req) {
  const { pathname } = req.nextUrl

  // Allow public stuff
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/auth') ||  // your auth pages
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next()
  }

  // Check for access_token cookie
  const token = req.cookies.get('access_token')?.value
  if (token) return NextResponse.next()

  // Not logged in → redirect to your real login page
  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/auth/login'  // ← change this to your actual login page path
  loginUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/create/:path*',
    '/home/:path*',
    '/blog/edit/:path*',
    '/info/:path*',
  ],
}