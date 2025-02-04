'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/contexts/toast-context'

export default function RegisterOrganizationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { showToast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const organizationData = {
        name: formData.get('name'),
        description: formData.get('description'),
        website: formData.get('website'),
        contact_email: formData.get('contact_email'),
        contact_phone: formData.get('contact_phone'),
      }

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert(organizationData)
        .select()
        .single()

      if (orgError) throw orgError

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Add user as organization admin
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: 'admin'
        })

      if (memberError) throw memberError

      showToast('Organization registered successfully!', 'success')
      router.push(`/organizations/${org.id}`)
    } catch (error: any) {
      showToast(error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Register Organization</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Organization Name</Label>
            <Input id="name" name="name" required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" type="url" />
          </div>

          <div>
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input id="contact_email" name="contact_email" type="email" required />
          </div>

          <div>
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input id="contact_phone" name="contact_phone" type="tel" />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Organization'}
          </Button>
        </form>
      </Card>
    </div>
  )
} 