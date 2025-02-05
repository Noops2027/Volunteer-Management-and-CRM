import Link from 'next/link'
import { UserNav } from './user-nav'

export function Header() {
  // Update sign in/register links
  const authLinks = {
    volunteer: {
      signin: '/auth/volunteer/signin',
      signup: '/auth/volunteer/signup'
    },
    organization: {
      signin: '/auth/organization/signin',
      signup: '/auth/organization/signup'
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <span className="font-bold text-white">VCM</span>
            </div>
            <span className="hidden md:inline-block font-semibold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Volunteer CRM
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-4">
            <Link
              href="/auth"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign in
            </Link>
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  )
} 