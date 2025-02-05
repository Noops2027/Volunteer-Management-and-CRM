'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, RefreshCw } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/contexts/toast-context'
import { useSearchParams } from 'next/navigation'

export default function CheckEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const supabase = createClientComponentClient()
  const { showToast } = useToast()

  async function handleResendEmail() {
    if (!email) {
      showToast('Email address not found', 'error')
      return
    }

    setIsResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) throw error

      showToast('Verification email resent successfully', 'success')
    } catch (error: any) {
      console.error('Resend error:', error)
      showToast(error.message, 'error')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="container max-w-lg py-16">
      <Card className="p-6 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Check your email
        </h1>
        <p className="text-gray-500 mb-6">
          We've sent you a verification link to{' '}
          <span className="font-medium text-gray-900">{email}</span>.
          Please check your email to verify your account.
        </p>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleResendEmail}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Resending...
              </>
            ) : (
              'Resend verification email'
            )}
          </Button>
          <Link href="/auth">
            <Button variant="ghost" className="w-full">
              Return to sign in
            </Button>
          </Link>
        </div>

        {/* Additional help text */}
        <p className="text-sm text-gray-500 mt-6">
          Don't see the email? Check your spam folder or try resending the verification email.
        </p>
      </Card>
    </div>
  )
} 