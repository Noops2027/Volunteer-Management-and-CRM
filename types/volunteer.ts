export type VolunteerStatus = 'active' | 'inactive' | 'pending'

export interface Volunteer {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  skills: string[]
  interests: string[]
  availability: {
    weekdays: boolean
    weekends: boolean
    mornings: boolean
    afternoons: boolean
    evenings: boolean
  }
  status: VolunteerStatus
  created_at: string
  updated_at: string
  emergency_contacts: EmergencyContact[]
  certifications: Certification[]
  background_checks: BackgroundCheck[]
  past_experiences: {
    organization: string
    role: string
    start_date: string
    end_date?: string
    description?: string
  }[]
  profile_image?: string
  bio?: string
  address: {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  preferences: {
    notifications: {
      email: boolean
      sms: boolean
    }
    privacy: {
      show_email: boolean
      show_phone: boolean
    }
  }
}

export interface VolunteerFilters {
  search?: string
  skills?: string[]
  availability?: string[]
  status?: VolunteerStatus
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

export interface Certification {
  name: string
  issuer: string
  issued_date: string
  expiry_date?: string
  verification_url?: string
}

export interface BackgroundCheck {
  type: string
  status: 'pending' | 'approved' | 'expired'
  issued_date: string
  expiry_date?: string
  reference_number?: string
} 