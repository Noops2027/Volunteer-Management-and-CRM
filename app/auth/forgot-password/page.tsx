'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/login" className="text-primary-600 hover:text-primary-500">
            return to sign in
          </Link>
        </p>
      </div>

      {success ? (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Check your email for a password reset link.
          </p>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}
    </>
  )
} 