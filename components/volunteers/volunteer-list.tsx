'use client'

import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import type { Volunteer } from '@/types/volunteer'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserCircle } from 'lucide-react'

export const columns: ColumnDef<Volunteer>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const first_name = row.original.first_name
      const last_name = row.original.last_name
      return `${first_name} ${last_name}`
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'skills',
    header: 'Skills',
    cell: ({ row }) => {
      const skills = row.original.skills || []
      return (
        <div className="flex flex-wrap gap-1">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              {skill}
            </span>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <span className={cn(
          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
          status === 'active' && "bg-green-100 text-green-800",
          status === 'inactive' && "bg-gray-100 text-gray-800",
          status === 'pending' && "bg-yellow-100 text-yellow-800"
        )}>
          {status}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const volunteer = row.original

      return (
        <div className="flex items-center gap-2">
          <Link href={`/volunteers/${volunteer.id}/profile`}>
            <Button variant="ghost" size="sm">
              <UserCircle className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </Link>
          {/* ... other actions ... */}
        </div>
      )
    }
  }
]

export function VolunteerList() {
  const searchParams = useSearchParams()
  
  const { data: volunteers, isLoading } = useQuery({
    queryKey: ['volunteers', searchParams.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/volunteers?${searchParams.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch volunteers')
      return response.json()
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <DataTable
      columns={columns}
      data={volunteers}
      searchKey="name"
    />
  )
} 