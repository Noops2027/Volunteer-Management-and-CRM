'use client'

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/contexts/toast-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { UserCircle } from 'lucide-react'

export function UserMenu({ email }: { email: string }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { showToast } = useToast()

  async function handleSignOut() {
    try {
      await supabase.auth.signOut()
      showToast('Signed out successfully', 'success')
      router.refresh()
    } catch (error) {
      showToast('Error signing out', 'error')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          <span className="hidden md:inline">{email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 