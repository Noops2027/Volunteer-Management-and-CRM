'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/contexts/toast-context'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  
  useEffect(() => {
    const token = searchParams.get('token')
    const type = searchParams.get('type')

    async function verifyEmail() {
      const supabase = createClientComponentClient()
      
      if (type === 'signup' && token) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        })

        if (error) {
          showToast('Failed to verify email: ' + error.message, 'error')
          router.push('/auth/error')
          return
        }

        showToast('Email verified successfully! You can now sign in.', 'success')
        router.push('/auth/signin')
      }
    }

    verifyEmail()
  }, [searchParams, router, showToast])

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
      <p className="text-gray-600">
        Please wait while we verify your email address.
      </p>
    </div>
  )
} 