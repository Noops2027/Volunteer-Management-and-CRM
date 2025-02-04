'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { VolunteerForm } from '@/components/volunteers/volunteer-form'
import type { Volunteer } from '@/types/volunteer'

export default function EditVolunteerPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false)

  const { data: volunteer, isLoading: isFetching } = useQuery({
    queryKey: ['volunteer', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/volunteers/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch volunteer')
      return response.json()
    },
  })

  async function handleSubmit(data: Partial<Volunteer>) {
    setIsLoading(true)
    const response = await fetch(`/api/volunteers/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    setIsLoading(false)
  }

  if (isFetching) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Volunteer</h1>
      <VolunteerForm 
        initialData={volunteer} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  )
} 