'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react'
import type { Volunteer, BackgroundCheck } from '@/types/volunteer'

interface BackgroundChecksFormProps {
  volunteerId: string
  onSubmit: (data: Partial<Volunteer>) => Promise<void>
  isLoading?: boolean
}

const CHECK_TYPES = [
  'DBS Basic',
  'DBS Standard',
  'DBS Enhanced',
  'Police Check',
  'Working with Children',
  'Identity Verification'
] as const

const emptyCheck: BackgroundCheck = {
  type: '',
  status: 'pending',
  issued_date: '',
  expiry_date: '',
  reference_number: ''
}

export function BackgroundChecksForm({ volunteerId, onSubmit, isLoading }: BackgroundChecksFormProps) {
  const [checks, setChecks] = useState<BackgroundCheck[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadChecks() {
      const { data } = await supabase
        .from('volunteers')
        .select('background_checks')
        .eq('id', volunteerId)
        .single()

      if (data?.background_checks) {
        setChecks(data.background_checks)
      }
    }
    loadChecks()
  }, [volunteerId, supabase])

  function addCheck() {
    setChecks([...checks, { ...emptyCheck }])
  }

  function removeCheck(index: number) {
    setChecks(checks.filter((_, i) => i !== index))
  }

  function updateCheck(index: number, field: keyof BackgroundCheck, value: string) {
    const updatedChecks = checks.map((check, i) => {
      if (i === index) {
        return { ...check, [field]: value }
      }
      return check
    })
    setChecks(updatedChecks)
  }

  function getStatusColor(status: BackgroundCheck['status']) {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function isExpired(check: BackgroundCheck) {
    if (!check.expiry_date) return false
    return new Date(check.expiry_date) < new Date()
  }

  function isExpiringSoon(check: BackgroundCheck) {
    if (!check.expiry_date) return false
    const expiryDate = new Date(check.expiry_date)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiryDate <= threeMonthsFromNow && expiryDate > new Date()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Update status based on expiry dates
    const updatedChecks = checks.map(check => ({
      ...check,
      status: isExpired(check) ? 'expired' : check.status
    }))
    await onSubmit({ background_checks: updatedChecks })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {checks.map((check, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-medium">Background Check {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeCheck(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`type-${index}`}>Type</Label>
              <Select
                value={check.type}
                onValueChange={(value) => updateCheck(index, 'type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select check type" />
                </SelectTrigger>
                <SelectContent>
                  {CHECK_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`status-${index}`}>Status</Label>
              <Select
                value={check.status}
                onValueChange={(value) => updateCheck(index, 'status', value as BackgroundCheck['status'])}
              >
                <SelectTrigger className={getStatusColor(check.status)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`issued-date-${index}`}>Issue Date</Label>
              <Input
                id={`issued-date-${index}`}
                type="date"
                value={check.issued_date}
                onChange={(e) => updateCheck(index, 'issued_date', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`expiry-date-${index}`}>Expiry Date</Label>
              <Input
                id={`expiry-date-${index}`}
                type="date"
                value={check.expiry_date}
                onChange={(e) => updateCheck(index, 'expiry_date', e.target.value)}
              />
              {isExpired(check) && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Check has expired
                </p>
              )}
              {isExpiringSoon(check) && (
                <p className="text-sm text-yellow-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Expiring soon
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={`reference-${index}`}>Reference Number</Label>
              <Input
                id={`reference-${index}`}
                value={check.reference_number}
                onChange={(e) => updateCheck(index, 'reference_number', e.target.value)}
                placeholder="e.g., DBS123456789"
              />
            </div>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addCheck}
        className="w-full"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Background Check
      </Button>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
} 