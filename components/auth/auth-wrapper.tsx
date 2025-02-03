'use client'

import { useAuth } from '@/contexts/auth-context'
import { LoadingScreen } from '@/components/ui/loading-screen'

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { loading, error } = useAuth()

  if (loading) return <LoadingScreen />
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  return <>{children}</>
} 