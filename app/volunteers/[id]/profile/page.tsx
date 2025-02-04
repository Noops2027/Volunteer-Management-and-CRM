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

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
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
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Volunteer Profile</h1>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="background">Background Checks</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <PersonalInfoForm 
              volunteerId={params.id}
              onSubmit={(data) => handleUpdate('Personal Info', data)}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="emergency" className="mt-6">
            <EmergencyContactsForm 
              volunteerId={params.id}
              onSubmit={(data) => handleUpdate('Emergency Contacts', data)}
            />
          </TabsContent>

          <TabsContent value="certifications" className="mt-6">
            <CertificationsForm
              volunteerId={params.id} 
              onSubmit={(data) => handleUpdate('Certifications', data)}
            />
          </TabsContent>

          <TabsContent value="background" className="mt-6">
            <BackgroundChecksForm
              volunteerId={params.id}
              onSubmit={(data) => handleUpdate('Background Checks', data)}
            />
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <PreferencesForm
              volunteerId={params.id}
              onSubmit={(data) => handleUpdate('Preferences', data)}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 