import { VolunteerList } from '@/components/volunteers/volunteer-list'
import { VolunteerFilters } from '@/components/volunteers/volunteer-filters'
import { CreateVolunteerButton } from '@/components/volunteers/create-volunteer-button'

export default function VolunteersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Volunteers</h1>
        <CreateVolunteerButton />
      </div>
      <aside className="w-64 shrink-0">
        <VolunteerFilters />
      </aside>
      <main className="flex-1">
        <VolunteerList />
      </main>
    </div>
  )
} 