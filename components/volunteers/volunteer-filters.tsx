'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const SKILLS = [
  'Communication',
  'Leadership',
  'Organization',
  'Technical',
  'Teaching',
  'Event Planning'
]

const AVAILABILITY = [
  { id: 'weekdays', label: 'Weekdays' },
  { id: 'weekends', label: 'Weekends' },
  { id: 'mornings', label: 'Mornings' },
  { id: 'afternoons', label: 'Afternoons' },
  { id: 'evenings', label: 'Evenings' }
]

const STATUS = [
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
  { id: 'pending', label: 'Pending' }
]

export function VolunteerFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  function updateSearch() {
    const params = new URLSearchParams(searchParams)
    if (selectedSkills.length) params.set('skills', selectedSkills.join(','))
    else params.delete('skills')
    if (selectedAvailability.length) params.set('availability', selectedAvailability.join(','))
    else params.delete('availability')
    if (selectedStatus) params.set('status', selectedStatus)
    else params.delete('status')
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SKILLS.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={selectedSkills.includes(skill)}
                onCheckedChange={(checked) => {
                  setSelectedSkills(prev => 
                    checked 
                      ? [...prev, skill]
                      : prev.filter(s => s !== skill)
                  )
                  updateSearch()
                }}
              />
              <Label htmlFor={skill}>{skill}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {AVAILABILITY.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={selectedAvailability.includes(id)}
                onCheckedChange={(checked) => {
                  setSelectedAvailability(prev => 
                    checked 
                      ? [...prev, id]
                      : prev.filter(a => a !== id)
                  )
                  updateSearch()
                }}
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {STATUS.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={selectedStatus === id}
                onCheckedChange={(checked) => {
                  setSelectedStatus(checked ? id : '')
                  updateSearch()
                }}
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
} 