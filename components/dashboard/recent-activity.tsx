import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/solid'

interface Event {
  id: string
  title: string
  start_date: string
  location: string
}

interface RecentActivityProps {
  events?: Event[]
}

export function RecentActivity({ events = [] }: RecentActivityProps) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <CalendarIcon className="h-5 w-5 text-primary-500" />
        <h3 className="ml-2 text-lg font-medium text-secondary-900">
          Upcoming Events
        </h3>
      </div>
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {events.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 ? (
                  <span
                    className="absolute left-3 top-4 -ml-px h-full w-0.5 bg-primary-100"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <span className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <CalendarIcon className="h-3 w-3 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-secondary-900">{event.title}</p>
                      <span className="text-sm text-primary-500">
                        {new Date(event.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-secondary-500">
                      <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 