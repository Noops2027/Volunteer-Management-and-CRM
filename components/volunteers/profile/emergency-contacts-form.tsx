'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { PlusCircle, Trash2 } from 'lucide-react'
import type { Volunteer, EmergencyContact } from '@/types/volunteer'

interface EmergencyContactsFormProps {
  volunteerId: string
  onSubmit: (data: Partial<Volunteer>) => Promise<void>
  isLoading?: boolean
}

const emptyContact: EmergencyContact = {
  name: '',
  relationship: '',
  phone: '',
  email: ''
}

export function EmergencyContactsForm({ volunteerId, onSubmit, isLoading }: EmergencyContactsFormProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadContacts() {
      const { data } = await supabase
        .from('volunteers')
        .select('emergency_contacts')
        .eq('id', volunteerId)
        .single()

      if (data?.emergency_contacts) {
        setContacts(data.emergency_contacts)
      }
    }
    loadContacts()
  }, [volunteerId, supabase])

  function addContact() {
    setContacts([...contacts, { ...emptyContact }])
  }

  function removeContact(index: number) {
    setContacts(contacts.filter((_, i) => i !== index))
  }

  function updateContact(index: number, field: keyof EmergencyContact, value: string) {
    const updatedContacts = contacts.map((contact, i) => {
      if (i === index) {
        return { ...contact, [field]: value }
      }
      return contact
    })
    setContacts(updatedContacts)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({ emergency_contacts: contacts })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {contacts.map((contact, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-medium">Contact {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeContact(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>Name</Label>
              <Input
                id={`name-${index}`}
                value={contact.name}
                onChange={(e) => updateContact(index, 'name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`relationship-${index}`}>Relationship</Label>
              <Input
                id={`relationship-${index}`}
                value={contact.relationship}
                onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`phone-${index}`}>Phone</Label>
              <Input
                id={`phone-${index}`}
                type="tel"
                value={contact.phone}
                onChange={(e) => updateContact(index, 'phone', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`email-${index}`}>Email</Label>
              <Input
                id={`email-${index}`}
                type="email"
                value={contact.email}
                onChange={(e) => updateContact(index, 'email', e.target.value)}
              />
            </div>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addContact}
        className="w-full"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Emergency Contact
      </Button>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
} 