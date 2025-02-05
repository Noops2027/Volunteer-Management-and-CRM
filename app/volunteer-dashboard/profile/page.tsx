'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/contexts/toast-context'
import { UserCircle, Mail, Phone, MapPin } from 'lucide-react'

interface Profile {
  name: string
  email: string
  phone?: string
  bio?: string
  location?: string
  skills?: string[]
  interests?: string[]
}

export default function VolunteerProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const supabase = createClientComponentClient()
  const { showToast } = useToast()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setProfile({
          name: user.user_metadata?.name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          bio: user.user_metadata?.bio || '',
          location: user.user_metadata?.location || '',
          skills: user.user_metadata?.skills || [],
          interests: user.user_metadata?.interests || []
        })
      }
    } catch (error) {
      showToast('Error loading profile', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const updates = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        bio: formData.get('bio'),
        location: formData.get('location')
      }

      const { error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) throw error

      setProfile(prev => ({ ...prev!, ...updates }))
      setIsEditing(false)
      showToast('Profile updated successfully!', 'success')
    } catch (error: any) {
      showToast(error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500">Manage your volunteer profile and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile?.name}</h2>
                <p className="text-sm text-gray-500">Volunteer</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    defaultValue={profile?.name} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={profile?.email} 
                    disabled 
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    defaultValue={profile?.phone} 
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    defaultValue={profile?.location} 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  defaultValue={profile?.bio}
                  rows={4} 
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{profile?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{profile?.phone}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{profile?.location}</span>
                  </div>
                )}
              </div>
              {profile?.bio && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
} 