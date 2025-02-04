'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@heroicons/react/24/outline'

export function CreateVolunteerButton() {
  const router = useRouter()

  return (
    <Button 
      onClick={() => router.push('/volunteers/new')}
      className="flex items-center gap-2"
    >
      <PlusIcon className="h-4 w-4" />
      Add Volunteer
    </Button>
  )
} 