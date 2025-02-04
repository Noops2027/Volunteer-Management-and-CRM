'use client'

import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { Users, Calendar, Building } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/volunteers">
          <Card className="p-6 card-shadow bg-gradient-to-br from-blue-50 to-white border-blue-100/50">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-blue-500 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Volunteers</p>
                <h2 className="text-3xl font-bold text-blue-900">0</h2>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/events">
          <Card className="p-6 card-shadow bg-gradient-to-br from-emerald-50 to-white border-emerald-100/50">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-500 text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">Upcoming Events</p>
                <h2 className="text-3xl font-bold text-emerald-900">0</h2>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/organizations">
          <Card className="p-6 card-shadow bg-gradient-to-br from-purple-50 to-white border-purple-100/50">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-purple-500 text-white">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Organizations</p>
                <h2 className="text-3xl font-bold text-purple-900">0</h2>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 card-shadow bg-white">
          <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            Upcoming Events
          </h2>
          <div className="space-y-4">
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
              No upcoming events
            </div>
          </div>
        </Card>

        <Card className="p-6 card-shadow bg-white">
          <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
            <Building className="h-5 w-5 mr-2 text-blue-500" />
            Recent Organizations
          </h2>
          <div className="space-y-4">
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
              No recent organizations
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 