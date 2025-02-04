'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { VolunteerForm } from '@/components/volunteers/volunteer-form'
import { useToast } from '@/contexts/toast-context'
import type { Volunteer } from '@/types/volunteer'

export default function NewVolunteerPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  async function handleSubmit(data: Partial<Volunteer>) {
    setIsLoading(true)
    console.log('Starting volunteer submission:', data)
    
    try {
      // Convert camelCase to snake_case for database
      const dbData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        skills: data.skills,
        interests: data.interests,
        availability: data.availability,
        status: data.status
      }

      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dbData),
      })

      const responseData = await response.json()
      console.log('API response:', { status: response.status, data: responseData })

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create volunteer')
      }

      return responseData
    } catch (error: any) {
      console.error('Volunteer creation error details:', {
        error,
        message: error.message,
        stack: error.stack
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Volunteer</h1>
      <VolunteerForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
} 