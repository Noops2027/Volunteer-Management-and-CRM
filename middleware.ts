import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get user type from session
  const userType = session?.user?.user_metadata?.type

  // Define public paths
  const publicPaths = [
    '/auth/volunteer/signin',
    '/auth/volunteer/signup',
    '/auth/organization/signin',
    '/auth/organization/signup',
    '/auth/verify',
    '/auth'
  ]
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // If user is not signed in and trying to access a protected route
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Redirect based on user type
  if (session) {
    // Organization users shouldn't access volunteer routes
    if (userType === 'organization' && request.nextUrl.pathname.startsWith('/volunteer-dashboard')) {
      return NextResponse.redirect(new URL('/org-dashboard', request.url))
    }

    // Volunteers shouldn't access organization routes
    if (userType === 'volunteer' && request.nextUrl.pathname.startsWith('/org-dashboard')) {
      return NextResponse.redirect(new URL('/volunteer-dashboard', request.url))
    }

    // Redirect to appropriate dashboard after login
    if (request.nextUrl.pathname === '/') {
      if (userType === 'organization') {
        return NextResponse.redirect(new URL('/org-dashboard', request.url))
      } else if (userType === 'volunteer') {
        return NextResponse.redirect(new URL('/volunteer-dashboard', request.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 