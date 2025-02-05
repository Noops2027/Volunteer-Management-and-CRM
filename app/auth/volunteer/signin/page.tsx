'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Users } from "lucide-react"
import Link from "next/link"
import { useToast } from '@/contexts/toast-context'

export default function VolunteerSignInPage() {
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

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Incorrect email or password')
        }
        if (error.message === 'Email not confirmed') {
          showToast('Please verify your email before signing in', 'error')
          router.push(`/auth/check-email?email=${encodeURIComponent(email)}`)
          return
        }
        throw error
      }

      if (!data.user) {
        throw new Error('No user data returned')
      }

      // Debug logs
      console.log('Sign in successful')
      console.log('User metadata:', data.user.user_metadata)
      console.log('User type:', data.user.user_metadata?.type)

      // First check user metadata
      const userType = data.user.user_metadata?.type

      if (userType === 'volunteer') {
        showToast('Successfully signed in!', 'success')
        router.push('/volunteer-dashboard')
        router.refresh()
        return
      }

      // If no type in metadata, check profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('type')
        .eq('id', data.user.id)
        .single()

      console.log('Profile data:', profile)

      if (profileError || profile?.type !== 'volunteer') {
        throw new Error('This account is not registered as a volunteer')
      }

      // If we get here, the profile confirms this is a volunteer
      showToast('Successfully signed in!', 'success')
      router.push('/volunteer-dashboard')
      router.refresh()
    } catch (error: any) {
      console.error('Sign in error:', error)
      showToast(error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-lg py-16">
      <Card className="p-6 border-t-4 border-t-blue-600">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Volunteer Sign In
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Access your volunteer dashboard and opportunities
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          <div className="text-right">
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Card>

      {/* Additional context */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
        <h3 className="font-medium mb-1">Signing in as a Volunteer</h3>
        <p>
          Access your volunteer profile, browse opportunities, and track your volunteer hours.
          New to volunteering?{' '}
          <Link href="/auth/volunteer/signup" className="text-blue-600 hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
} 