'use client'

import { useAuth } from '@/contexts/auth-context'
import { PropsWithChildren } from 'react'

type Role = 'admin' | 'coordinator' | 'volunteer'

interface RoleGuardProps extends PropsWithChildren {
  allowedRoles: Role[]
  fallback?: React.ReactNode
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleGuardProps) {
  const { user } = useAuth()
  const userRole = user?.user_metadata?.role as Role

  if (!user || !allowedRoles.includes(userRole)) {
    return fallback
  }

  return <>{children}</>
} 