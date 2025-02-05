'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalVolunteers: number
  activeEvents: number
  totalHours: number
}

export default function OrganizationDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalVolunteers: 0,
    activeEvents: 0,
    totalHours: 0
  })
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        console.log('Dashboard - User:', user)
        
        if (!user) {
          throw new Error('No user found')
        }

        if (user.user_metadata?.type !== 'organization') {
          throw new Error('Not an organization account')
        }

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        console.log('Dashboard - Profile:', profile)
        if (profileError) console.error('Profile error:', profileError)

        // Fetch dashboard stats
        // TODO: Replace with actual queries once tables are set up
        setStats({
          totalVolunteers: 0,
          activeEvents: 0,
          totalHours: 0
        })

        setIsLoading(false)
      } catch (error: any) {
        console.error('Dashboard error:', error)
        setError(error.message)
        router.push('/auth')
      }
    }
    
    checkUser()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="p-6 text-center text-red-600">
          <p>Error: {error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organization Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/events/new">Create Event</Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
              <p className="text-2xl font-bold mt-1">{stats.totalVolunteers}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <Link 
            href="/dashboard/volunteers" 
            className="text-sm text-blue-600 hover:text-blue-700 mt-4 inline-flex items-center"
          >
            View all volunteers
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-2xl font-bold mt-1">{stats.activeEvents}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <Link 
            href="/dashboard/events" 
            className="text-sm text-green-600 hover:text-green-700 mt-4 inline-flex items-center"
          >
            Manage events
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold mt-1">{stats.totalHours}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <Link 
            href="/dashboard/hours" 
            className="text-sm text-purple-600 hover:text-purple-700 mt-4 inline-flex items-center"
          >
            View hours log
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-center py-8">No recent activity</p>
      </Card>
    </div>
  )
} 