'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card } from "@/components/ui/card"
import { 
  Users, 
  Calendar, 
  Clock, 
  Bell 
} from 'lucide-react'
import type { Organization } from '@/types/organization'

export default function OrgDashboardPage() {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadOrganization() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('contact_email', user.email)
        .single()

      if (org) setOrganization(org)
    }

    loadOrganization()
  }, [supabase])

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          {organization?.name || 'Organization'} Dashboard
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Quick stats */}
        <Card className="p-6 card-shadow bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center space-x-4">
            <Users className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Volunteers</p>
              <h2 className="text-2xl font-bold">0</h2>
            </div>
          </div>
        </Card>

        {/* Add more stat cards */}
      </div>

      {/* Main content area */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent activity, upcoming events, etc. */}
      </div>
    </div>
  )
} 