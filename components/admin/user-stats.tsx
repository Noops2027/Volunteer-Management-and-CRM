'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  UsersIcon,
  UserPlusIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

interface Stats {
  totalUsers: number
  newUsersToday: number
  verifiedUsers: number
  pendingVerification: number
}

export function UserStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    newUsersToday: 0,
    verifiedUsers: 0,
    pendingVerification: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: allUsers } = await supabase
      .from('profiles')
      .select('*')

    const { data: newUsers } = await supabase
      .from('profiles')
      .select('*')
      .gte('created_at', today.toISOString())

    if (allUsers) {
      setStats({
        totalUsers: allUsers.length,
        newUsersToday: newUsers?.length || 0,
        verifiedUsers: allUsers.filter(u => u.email_confirmed_at).length,
        pendingVerification: allUsers.filter(u => !u.email_confirmed_at).length,
      })
    }
    setLoading(false)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {[
        {
          name: 'Total Users',
          value: stats.totalUsers,
          icon: UsersIcon,
          color: 'bg-blue-500',
        },
        {
          name: 'New Today',
          value: stats.newUsersToday,
          icon: UserPlusIcon,
          color: 'bg-green-500',
        },
        {
          name: 'Verified Users',
          value: stats.verifiedUsers,
          icon: CheckCircleIcon,
          color: 'bg-indigo-500',
        },
        {
          name: 'Pending Verification',
          value: stats.pendingVerification,
          icon: ExclamationCircleIcon,
          color: 'bg-yellow-500',
        },
      ].map((stat) => (
        <div
          key={stat.name}
          className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
        >
          <dt>
            <div className={`absolute rounded-md ${stat.color} p-3`}>
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </dd>
        </div>
      ))}
    </div>
  )
} 