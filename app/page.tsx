import { supabase } from '@/lib/supabase/client'
import { DashboardStats } from '@/components/dashboard/stats'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { BuildingOfficeIcon } from '@heroicons/react/24/solid'

// Define database types
interface Event {
  id: string
  title: string
  start_date: string
  location: string
}

interface Organization {
  id: string
}

// Supabase response types
interface CountResponse {
  data: any[] | null
  count: number | null
  error: any
}

interface EventsResponse {
  data: Event[] | null
  error: any
}

interface OrganizationsResponse {
  data: Organization[] | null
  error: any
}

export default async function Home() {
  // Type the Supabase responses
  const { count: volunteerCount }: CountResponse = await supabase
    .from('volunteer_profiles')
    .select('*', { count: 'exact', head: true })

  const { data: upcomingEvents }: EventsResponse = await supabase
    .from('events')
    .select('id, title, start_date, location')
    .gte('start_date', new Date().toISOString())
    .limit(5)

  const { data: organizations }: OrganizationsResponse = await supabase
    .from('organizations')
    .select('id')
    .limit(5)

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Dashboard
        </h1>
      </header>

      <div className="space-y-8">
        <DashboardStats
          stats={[
            { name: 'Total Volunteers', value: volunteerCount || 0 },
            { name: 'Upcoming Events', value: upcomingEvents?.length || 0 },
            { name: 'Organizations', value: organizations?.length || 0 },
          ]}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentActivity events={upcomingEvents || []} />
          <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <BuildingOfficeIcon className="h-5 w-5 text-primary-500" />
              <h3 className="ml-2 text-lg font-medium text-secondary-900">
                Recent Organizations
              </h3>
            </div>
            {/* Organization list content */}
          </div>
        </div>
      </div>
    </>
  )
} 