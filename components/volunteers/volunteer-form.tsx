'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Volunteer, VolunteerStatus } from '@/types/volunteer'
import { useToast } from '@/contexts/toast-context'

interface VolunteerFormProps {
  initialData?: Partial<Volunteer>
  onSubmit: (data: Partial<Volunteer>) => Promise<void>
  isLoading?: boolean
}

const defaultAvailability = {
  weekdays: false,
  weekends: false,
  mornings: false,
  afternoons: false,
  evenings: false
}

const SKILLS = [
  'Communication',
  'Leadership',
  'Organization',
  'Technical',
  'Teaching',
  'Event Planning'
] as const

const INTERESTS = [
  'Education',
  'Environment',
  'Health',
  'Social Services',
  'Arts & Culture',
  'Animal Welfare'
] as const

export function VolunteerForm({ 
  initialData = {}, 
  onSubmit,
  isLoading 
}: VolunteerFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [localLoading, setLocalLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Volunteer>>({
    first_name: initialData.first_name ?? '',
    last_name: initialData.last_name ?? '',
    email: initialData.email ?? '',
    phone: initialData.phone ?? '',
    skills: initialData.skills ?? [],
    interests: initialData.interests ?? [],
    availability: initialData.availability ?? defaultAvailability,
    status: initialData.status ?? 'pending'
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalLoading(true)
    
    try {
      // Validate form data before submission
      if (!formData.first_name || !formData.last_name || !formData.email) {
        throw new Error('Please fill in all required fields')
      }

      console.log('Attempting to submit form data:', formData)
      const result = await onSubmit(formData)
      console.log('Form submission result:', result)

      showToast('Volunteer saved successfully!', 'success')
      router.push('/volunteers')
    } catch (error: any) {
      console.error('Form submission error details:', {
        error,
        message: error.message,
        stack: error.stack
      })
      showToast(error?.message || 'Failed to save volunteer', 'error')
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last name</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Skills</Label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SKILLS.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={`skill-${skill}`}
                checked={formData.skills?.includes(skill)}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    skills: checked
                      ? [...(formData.skills ?? []), skill]
                      : formData.skills?.filter(s => s !== skill) ?? []
                  })
                }}
              />
              <Label htmlFor={`skill-${skill}`}>{skill}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Interests</Label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {INTERESTS.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={`interest-${interest}`}
                checked={formData.interests?.includes(interest)}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    interests: checked
                      ? [...(formData.interests ?? []), interest]
                      : formData.interests?.filter(i => i !== interest) ?? []
                  })
                }}
              />
              <Label htmlFor={`interest-${interest}`}>{interest}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Availability</Label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Object.entries(formData.availability ?? defaultAvailability).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`availability-${key}`}
                checked={value}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    availability: {
                      ...(formData.availability ?? defaultAvailability),
                      [key]: checked as boolean
                    }
                  })
                }}
              />
              <Label htmlFor={`availability-${key}`}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {initialData.id && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: string) => setFormData({ ...formData, status: value as VolunteerStatus })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading || localLoading}>
          {isLoading || localLoading ? 'Saving...' : 'Save Volunteer'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/volunteers')}
          disabled={isLoading || localLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
} 