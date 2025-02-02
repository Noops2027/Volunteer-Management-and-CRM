import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth routes handling
  if (request.nextUrl.pathname.startsWith('/auth')) {
    if (session) {
      // If user is signed in and tries to access auth pages, redirect to home
      return NextResponse.redirect(new URL('/', request.url))
    }
    return res
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