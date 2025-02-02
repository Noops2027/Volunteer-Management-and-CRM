'use client'

interface BulkActionsProps {
  selectedUsers: string[]
  onSuspend: () => void
  onDelete: () => void
  onExport: () => void
}

export function BulkActions({ selectedUsers, onSuspend, onDelete, onExport }: BulkActionsProps) {
  const count = selectedUsers.length

  if (count === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">
              {count} user{count !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onExport}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Export
            </button>
            <button
              onClick={onSuspend}
              className="inline-flex items-center px-3 py-1.5 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
            >
              Suspend
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 