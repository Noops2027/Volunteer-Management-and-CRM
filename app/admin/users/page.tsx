'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { UserSearch } from '@/components/admin/user-search'
import { ActivityLog } from '@/components/admin/activity-log'
import { BulkActions } from '@/components/admin/bulk-actions'
import { UserStats } from '@/components/admin/user-stats'

interface User {
  id: string
  email: string
  role: string
  created_at: string
  last_sign_in_at: string
  email_confirmed_at: string | null
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  })
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (users.length > 0) {
      let filtered = [...users]

      if (filters.search) {
        filtered = filtered.filter(user => 
          user.email.toLowerCase().includes(filters.search.toLowerCase())
        )
      }

      if (filters.role) {
        filtered = filtered.filter(user => user.role === filters.role)
      }

      if (filters.status) {
        filtered = filtered.filter(user => 
          filters.status === 'verified' ? user.email_confirmed_at : !user.email_confirmed_at
        )
      }

      setFilteredUsers(filtered)
    }
  }, [users, filters])

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setUsers(data)
    }
    setLoading(false)
  }

  async function updateUserRole(userId: string, newRole: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'User role updated successfully' })
      fetchUsers()
    }
  }

  const handleBulkSuspend = async () => {
    // Implement suspend logic
  }

  const handleBulkDelete = async () => {
    // Implement delete logic
  }

  const handleExport = () => {
    const csv = filteredUsers
      .map(user => [
        user.email,
        user.role,
        user.created_at,
        user.email_confirmed_at ? 'Verified' : 'Pending'
      ].join(','))
      .join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    a.click()
  }

  return (
    <>
      <UserStats />

      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            User Management
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <UserSearch
                onSearch={(query) => setFilters(f => ({ ...f, search: query }))}
                onFilterRole={(role) => setFilters(f => ({ ...f, role }))}
                onFilterStatus={(status) => setFilters(f => ({ ...f, status }))}
              />

              {message && (
                <div className={`mb-4 p-4 rounded-md ${
                  message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                            Email
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Role
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Joined
                          </th>
                          <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                              {user.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <select
                                value={user.role}
                                onChange={(e) => updateUserRole(user.id, e.target.value)}
                                className="rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="coordinator">Coordinator</option>
                              </select>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                user.email_confirmed_at
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.email_confirmed_at ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <button
                                onClick={() => {/* Add user details view */}}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                View<span className="sr-only">, {user.email}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
                Recent Activity
              </h3>
              <ActivityLog />
            </div>
          </div>
        </div>
      </div>

      <BulkActions
        selectedUsers={selectedUsers}
        onSuspend={handleBulkSuspend}
        onDelete={handleBulkDelete}
        onExport={handleExport}
      />
    </>
  )
} 