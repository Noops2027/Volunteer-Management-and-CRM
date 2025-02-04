'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PersonalInfoForm } from '@/components/volunteers/profile/personal-info-form'
import { EmergencyContactsForm } from '@/components/volunteers/profile/emergency-contacts-form'
import { CertificationsForm } from '@/components/volunteers/profile/certifications-form'
import { BackgroundChecksForm } from '@/components/volunteers/profile/background-checks-form'
import { PreferencesForm } from '@/components/volunteers/profile/preferences-form'
import { useToast } from '@/contexts/toast-context'
import type { Volunteer } from '@/types/volunteer'

export default function VolunteerProfilePage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { showToast } = useToast()

  async function handleUpdate(section: string, data: Partial<Volunteer>) {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('volunteers')
        .update(data)
        .eq('id', params.id)

      if (error) throw error

      showToast(`${section} updated successfully`, 'success')
      router.refresh()
    } catch (error: any) {
      showToast(error.message || `Failed to update ${section}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Volunteer Profile</h1>
      
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="checks">Background Checks</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm 
                volunteerId={params.id} 
                onSubmit={(data) => handleUpdate('Personal Info', data)}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add other TabsContent components for each section */}
      </Tabs>
    </div>
  )
} 