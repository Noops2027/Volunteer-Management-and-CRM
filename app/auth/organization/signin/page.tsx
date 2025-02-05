'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Building2 } from "lucide-react"
import Link from "next/link"
import { useToast } from '@/contexts/toast-context'

export default function OrganizationSignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { showToast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      })

      if (error) throw error

      // Debug logs
      console.log('Sign in successful')
      console.log('User metadata:', data.user?.user_metadata)

      // Verify user type
      const userType = data.user?.user_metadata?.type

      if (userType !== 'organization') {
        // Double check in profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user?.id)
          .single()

        if (profileError || profile?.user_type !== 'organization') {
          throw new Error('This account is not registered as an organization')
        }
      }

      showToast('Successfully signed in!', 'success')
      router.push('/dashboard')
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
      <Card className="p-6 border-t-4 border-t-purple-600">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Organization Sign In
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Access your organization dashboard
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
      <div className="mt-6 bg-purple-50 rounded-lg p-4 text-sm text-purple-700">
        <h3 className="font-medium mb-1">Need an organization account?</h3>
        <p>
          <Link href="/auth/organization/signup" className="text-purple-600 hover:underline font-medium">
            Register your organization
          </Link>
          {' '}to start managing volunteers and events.
        </p>
      </div>
    </div>
  )
} 