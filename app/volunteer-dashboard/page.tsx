'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function VolunteerDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        console.log('Dashboard - User:', user)
        
        if (!user) {
          throw new Error('No user found')
        }

        if (user.user_metadata?.type !== 'volunteer') {
          throw new Error('Not a volunteer account')
        }

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        console.log('Dashboard - Profile:', profile)
        if (profileError) console.error('Profile error:', profileError)

        setIsLoading(false)
      } catch (error: any) {
        console.error('Dashboard error:', error)
        setError(error.message)
        router.push('/auth')
      }
    }
    
    checkUser()
  }, [router, supabase])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
      <p>If you see this, routing is working!</p>
    </div>
  )
} 