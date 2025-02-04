'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { PlusCircle, Trash2, Upload, ExternalLink } from 'lucide-react'
import type { Volunteer, Certification } from '@/types/volunteer'

interface CertificationsFormProps {
  volunteerId: string
  onSubmit: (data: Partial<Volunteer>) => Promise<void>
  isLoading?: boolean
}

const emptyCertification: Certification = {
  name: '',
  issuer: '',
  issued_date: '',
  expiry_date: '',
  verification_url: ''
}

export function CertificationsForm({ volunteerId, onSubmit, isLoading }: CertificationsFormProps) {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({})
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadCertifications() {
      const { data } = await supabase
        .from('volunteers')
        .select('certifications')
        .eq('id', volunteerId)
        .single()

      if (data?.certifications) {
        setCertifications(data.certifications)
      }
    }
    loadCertifications()
  }, [volunteerId, supabase])

  async function handleFileUpload(index: number, file: File) {
    setUploading({ ...uploading, [index]: true })
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${volunteerId}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('certifications')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('certifications')
        .getPublicUrl(fileName)

      updateCertification(index, 'verification_url', publicUrl)
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploading({ ...uploading, [index]: false })
    }
  }

  function addCertification() {
    setCertifications([...certifications, { ...emptyCertification }])
  }

  function removeCertification(index: number) {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  function updateCertification(index: number, field: keyof Certification, value: string) {
    const updatedCertifications = certifications.map((cert, i) => {
      if (i === index) {
        return { ...cert, [field]: value }
      }
      return cert
    })
    setCertifications(updatedCertifications)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({ certifications })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {certifications.map((cert, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-medium">Certification {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeCertification(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>Name</Label>
              <Input
                id={`name-${index}`}
                value={cert.name}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`issuer-${index}`}>Issuer</Label>
              <Input
                id={`issuer-${index}`}
                value={cert.issuer}
                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`issued-date-${index}`}>Issue Date</Label>
              <Input
                id={`issued-date-${index}`}
                type="date"
                value={cert.issued_date}
                onChange={(e) => updateCertification(index, 'issued_date', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`expiry-date-${index}`}>Expiry Date</Label>
              <Input
                id={`expiry-date-${index}`}
                type="date"
                value={cert.expiry_date}
                onChange={(e) => updateCertification(index, 'expiry_date', e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Verification Document</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(index, file)
                  }}
                  className="flex-1"
                />
                {cert.verification_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a 
                      href={cert.verification_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addCertification}
        className="w-full"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Certification
      </Button>

      <Button 
        type="submit" 
        disabled={isLoading || Object.values(uploading).some(Boolean)} 
        className="w-full"
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
} 