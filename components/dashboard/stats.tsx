import { 
  UsersIcon, 
  CalendarIcon, 
  BuildingOfficeIcon 
} from '@heroicons/react/24/solid'

interface StatsProps {
  stats: Array<{ name: string; value: number }>
}

const icons = {
  'Total Volunteers': UsersIcon,
  'Upcoming Events': CalendarIcon,
  'Organizations': BuildingOfficeIcon,
}

export function DashboardStats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((item) => {
        const Icon = icons[item.name as keyof typeof icons]
        return (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 sm:px-6"
          >
            <div className="flex items-center">
              <div className="rounded-md bg-primary-500 p-2.5">
                <Icon className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div className="ml-4 flex-1">
                <p className="truncate text-sm font-medium text-gray-500">
                  {item.name}
                </p>
                <p className="mt-1 text-xl font-semibold text-secondary-900">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 