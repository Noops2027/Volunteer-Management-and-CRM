import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define public paths that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/signup', '/auth/verify', '/auth/check-email', '/auth/error']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Handle /auth/login redirect first
  if (request.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If user is not signed in and trying to access a protected route
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If user is signed in and trying to access auth pages
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Protected routes handling
  if (
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/profile')
  ) {
    if (!session) {
      // If user is not signed in, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // For admin routes, check if user has admin role
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const role = session.user?.user_metadata?.role
      if (role !== 'admin') {
        // If user is not an admin, redirect to home
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 