'use client'

interface UserSearchProps {
  onSearch: (query: string) => void
  onFilterRole: (role: string) => void
  onFilterStatus: (status: string) => void
}

export function UserSearch({ onSearch, onFilterRole, onFilterStatus }: UserSearchProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
      <div className="sm:col-span-2">
        <label htmlFor="search" className="sr-only">
          Search users
        </label>
        <input
          type="search"
          name="search"
          id="search"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Search by email or name"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div>
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          onChange={(e) => onFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="coordinator">Coordinator</option>
          <option value="user">User</option>
        </select>
      </div>
      <div>
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          onChange={(e) => onFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
  )
} 