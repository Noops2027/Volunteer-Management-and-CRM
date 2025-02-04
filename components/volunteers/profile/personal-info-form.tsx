'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Volunteer } from '@/types/volunteer'

interface PersonalInfoFormProps {
  volunteerId: string
  onSubmit: (data: Partial<Volunteer>) => Promise<void>
  isLoading?: boolean
}

export function PersonalInfoForm({ volunteerId, onSubmit, isLoading }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<Partial<Volunteer>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    }
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadVolunteer() {
      const { data } = await supabase
        .from('volunteers')
        .select('*')
        .eq('id', volunteerId)
        .single()

      if (data) {
        setFormData(data)
      }
    }
    loadVolunteer()
  }, [volunteerId, supabase])

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      await onSubmit(formData)
    }} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last name</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              value={formData.address?.street}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address!, street: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.address?.city}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address!, city: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.address?.state}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address!, state: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              value={formData.address?.postal_code}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address!, postal_code: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.address?.country}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address!, country: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
} 