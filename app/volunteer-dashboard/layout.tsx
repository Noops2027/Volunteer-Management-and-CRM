'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Users,
  Calendar,
  Clock,
  UserCircle,
  Bell,
  Settings,
  Search,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/volunteer-dashboard', icon: Users },
  { name: 'Opportunities', href: '/volunteer-dashboard/opportunities', icon: Search },
  { name: 'My Schedule', href: '/volunteer-dashboard/schedule', icon: Calendar },
  { name: 'Hours Log', href: '/volunteer-dashboard/hours', icon: Clock },
  { name: 'Achievements', href: '/volunteer-dashboard/achievements', icon: Award },
  { name: 'Profile', href: '/volunteer-dashboard/profile', icon: UserCircle },
  { name: 'Notifications', href: '/volunteer-dashboard/notifications', icon: Bell },
  { name: 'Settings', href: '/volunteer-dashboard/settings', icon: Settings },
]

export default function VolunteerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [userName, setUserName] = useState<string>('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getUserProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name)
      }
    }
    getUserProfile()
  }, [supabase])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Side Navigation */}
      <div className="fixed inset-y-0 flex w-64 flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link href="/volunteer-dashboard" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <span className="font-bold text-white">VCM</span>
                </div>
                <span className="font-semibold text-xl">Volunteer</span>
              </Link>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600',
                        'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{userName}</p>
                <p className="text-xs font-medium text-gray-500">Volunteer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  )
} 