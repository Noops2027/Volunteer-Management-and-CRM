'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase/client'

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: passwords.new
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully' })
      setPasswords({ current: '', new: '', confirm: '' })
    }
    setLoading(false)
  }

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Account Settings
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-6 sm:p-8">
            <div className="max-w-2xl space-y-8">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Email Address</h3>
                <div className="mt-2 flex items-center gap-x-3">
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  {!user?.email_confirmed_at && (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Unverified
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
                  {message && (
                    <div className={`p-4 rounded-md ${
                      message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="current-password"
                      id="current-password"
                      required
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="new-password"
                      id="new-password"
                      required
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirm-password"
                      id="confirm-password"
                      required
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 