'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/toast-context'

export function VolunteerSignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { showToast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const name = formData.get('name') as string

      console.log('Starting signup process for:', email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            type: 'volunteer',
            name: name
          }
        }
      })

      if (error) {
        console.error('Signup error details:', error)
        throw error
      }

      // Log the full response for debugging
      console.log('Full signup response:', JSON.stringify(data, null, 2))

      if (!data.user?.confirmation_sent_at) {
        throw new Error('Email confirmation was not sent')
      }

      showToast('Account created! Please check your email to verify your account.', 'success')
      router.push(`/auth/check-email?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      console.error('Signup error:', error)
      showToast(error.message || 'Failed to create account', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" required />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Volunteer Account'}
      </Button>
    </form>
  )
} 