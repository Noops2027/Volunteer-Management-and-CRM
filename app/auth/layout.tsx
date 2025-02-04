'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isOrganization = pathname.includes('/organization/')
  const isVolunteer = pathname.includes('/volunteer/')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <span className="font-bold text-white">VCM</span>
              </div>
              <span className="font-semibold text-xl">Volunteer CRM</span>
            </Link>
            <div className="flex items-center space-x-4">
              {!pathname.includes('/signin') && (
                <Link 
                  href={isOrganization ? "/auth/organization/signin" : "/auth/volunteer/signin"}
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Sign in
                </Link>
              )}
              <Link 
                href="/auth" 
                className="text-sm text-primary hover:text-primary-dark"
              >
                Switch account type
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Account Type Indicator */}
      {(isOrganization || isVolunteer) && (
        <div className={cn(
          "py-2 text-center text-sm text-white",
          isOrganization ? "bg-purple-600" : "bg-blue-600"
        )}>
          You are in the {isOrganization ? "Organization" : "Volunteer"} portal
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500">
        <p>
          {isOrganization ? (
            <>
              Looking to volunteer instead?{' '}
              <Link href="/auth/volunteer/signin" className="text-primary hover:underline">
                Go to volunteer sign in
              </Link>
            </>
          ) : isVolunteer ? (
            <>
              Representing an organization?{' '}
              <Link href="/auth/organization/signin" className="text-primary hover:underline">
                Go to organization sign in
              </Link>
            </>
          ) : null}
        </p>
      </footer>
    </div>
  )
} 