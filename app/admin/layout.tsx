import { RoleGuard } from '@/components/auth/role-guard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard 
      allowedRoles={['admin']} 
      fallback={
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="mt-2 text-sm text-gray-500">
            You don't have permission to access this area.
          </p>
        </div>
      }
    >
      {children}
    </RoleGuard>
  )
} 