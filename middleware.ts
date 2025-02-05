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
  
  console.log('Middleware - Current path:', request.nextUrl.pathname)
  console.log('Middleware - User type:', userType)
  console.log('Middleware - Session:', !!session)

  // Define public paths that don't require authentication
  const publicPaths = [
    '/auth',
    '/auth/volunteer/signin',
    '/auth/volunteer/signup',
    '/auth/organization/signin',
    '/auth/organization/signup',
    '/auth/callback',
    '/auth/check-email',
    '/auth/verify'
  ]

  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  )

  // If user is not signed in and trying to access a protected route
  if (!session && !isPublicPath) {
    console.log('Middleware - Redirecting to /auth (no session)')
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Handle authenticated users
  if (session) {
    // Redirect from root
    if (request.nextUrl.pathname === '/') {
      if (userType === 'volunteer') {
        console.log('Middleware - Redirecting volunteer to dashboard')
        return NextResponse.redirect(new URL('/volunteer-dashboard', request.url))
      }
      if (userType === 'organization') {
        console.log('Middleware - Redirecting organization to dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Prevent volunteers from accessing organization routes
    if (userType === 'volunteer' && request.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('Middleware - Volunteer accessing org route, redirecting')
      return NextResponse.redirect(new URL('/volunteer-dashboard', request.url))
    }

    // Prevent organizations from accessing volunteer routes
    if (userType === 'organization' && request.nextUrl.pathname.startsWith('/volunteer-dashboard')) {
      console.log('Middleware - Org accessing volunteer route, redirecting')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  const protectedPaths = {
    volunteer: {
      base: '/volunteer-dashboard',
      allowed: [
        '/volunteer-dashboard',
        '/volunteer-dashboard/profile',
        '/volunteer-dashboard/opportunities',
        '/volunteer-dashboard/schedule',
        '/volunteer-dashboard/hours',
        '/volunteer-dashboard/settings'
      ]
    },
    organization: {
      base: '/dashboard',
      allowed: [
        '/dashboard',
        '/dashboard/profile',
        '/dashboard/volunteers',
        '/dashboard/events',
        '/dashboard/settings'
      ]
    }
  }

  // Use in middleware
  if (userType === 'volunteer' && !protectedPaths.volunteer.allowed.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(protectedPaths.volunteer.base, request.url))
  }

  // Add more detailed logging
  console.log({
    path: request.nextUrl.pathname,
    userType: userType,
    hasSession: !!session,
    isPublicPath: isPublicPath
  })

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 