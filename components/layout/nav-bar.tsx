"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { UserMenu } from '@/components/auth/user-menu'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Volunteers', href: '/volunteers' },
  { name: 'Events', href: '/events' },
  { name: 'Organizations', href: '/organizations' },
]

export function NavBar() {
  const pathname = usePathname()
  const [email, setEmail] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setEmail(user?.email ?? null)
    }
    getUser()
  }, [supabase.auth])

  return (
    <div className="bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-primary p-2 rounded-lg">
                <span className="font-bold text-white">VCM</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      } rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {email ? (
              <UserMenu email={email} />
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-primary hover:bg-primary/5 rounded-md px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                } block rounded-md px-3 py-2 text-base font-medium`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
} 