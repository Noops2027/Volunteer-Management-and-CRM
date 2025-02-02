export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string
          phone: string
          avatar_url?: string
          status: 'active' | 'inactive'
          last_login_at?: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string
          avatar_url?: string
          status?: 'active' | 'inactive'
        }
        Update: {
          email?: string
          full_name?: string
          phone?: string
          avatar_url?: string
          status?: 'active' | 'inactive'
          last_login_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'volunteer' | 'staff' | 'member' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'volunteer' | 'staff' | 'member' | 'admin'
        }
        Update: {
          role?: 'volunteer' | 'staff' | 'member' | 'admin'
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          type: 'charity' | 'non_profit' | 'community'
          created_at: string
          contact_email: string
          contact_phone: string
          address: string
          status: 'active' | 'inactive'
        }
        Insert: {
          id?: string
          name: string
          type: 'charity' | 'non_profit' | 'community'
          contact_email: string
          contact_phone?: string
          address?: string
          status?: 'active' | 'inactive'
        }
        Update: {
          name?: string
          type?: 'charity' | 'non_profit' | 'community'
          contact_email?: string
          contact_phone?: string
          address?: string
          status?: 'active' | 'inactive'
        }
      }
      volunteer_profiles: {
        Row: {
          id: string
          user_id: string
          availability: string[]
          interests: string[]
          emergency_contact: string
          created_at: string
          status: 'active' | 'inactive'
        }
        Insert: {
          id?: string
          user_id: string
          availability?: string[]
          interests?: string[]
          emergency_contact?: string
          status?: 'active' | 'inactive'
        }
        Update: {
          availability?: string[]
          interests?: string[]
          emergency_contact?: string
          status?: 'active' | 'inactive'
        }
      }
      appointments: {
        Row: {
          id: string
          title: string
          description?: string
          start_time: string
          end_time: string
          type_id: string
          status: 'scheduled' | 'completed' | 'cancelled'
          location?: string
          created_at: string
          created_by: string
          organization_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          start_time: string
          end_time: string
          type_id: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          location?: string
          created_by: string
          organization_id: string
        }
        Update: {
          title?: string
          description?: string
          start_time?: string
          end_time?: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          location?: string
        }
      }
      interactions: {
        Row: {
          id: string
          user_id: string
          type: 'email' | 'call' | 'meeting' | 'note'
          description: string
          created_at: string
          created_by: string
          organization_id: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'email' | 'call' | 'meeting' | 'note'
          description: string
          created_by: string
          organization_id: string
        }
        Update: {
          type?: 'email' | 'call' | 'meeting' | 'note'
          description?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
        }
        Update: {
          name?: string
          category?: string
        }
      }
      volunteer_skills: {
        Row: {
          id: string
          volunteer_id: string
          skill_id: string
          proficiency_level: 'beginner' | 'intermediate' | 'advanced'
          created_at: string
        }
        Insert: {
          id?: string
          volunteer_id: string
          skill_id: string
          proficiency_level?: 'beginner' | 'intermediate' | 'advanced'
        }
        Update: {
          proficiency_level?: 'beginner' | 'intermediate' | 'advanced'
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          organization_id: string
          description?: string
          created_at: string
          status: 'active' | 'inactive'
        }
        Insert: {
          id?: string
          name: string
          organization_id: string
          description?: string
          status?: 'active' | 'inactive'
        }
        Update: {
          name?: string
          description?: string
          status?: 'active' | 'inactive'
        }
      }
      programs: {
        Row: {
          id: string
          name: string
          organization_id: string
          department_id?: string
          description: string
          start_date: string
          end_date?: string
          created_at: string
          status: 'planning' | 'active' | 'completed' | 'cancelled'
        }
        Insert: {
          id?: string
          name: string
          organization_id: string
          department_id?: string
          description: string
          start_date: string
          end_date?: string
          status?: 'planning' | 'active' | 'completed' | 'cancelled'
        }
        Update: {
          name?: string
          description?: string
          start_date?: string
          end_date?: string
          status?: 'planning' | 'active' | 'completed' | 'cancelled'
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          organization_id: string
          program_id?: string
          start_date: string
          end_date: string
          location: string
          max_volunteers?: number
          created_at: string
          status: 'draft' | 'published' | 'cancelled' | 'completed'
        }
        Insert: {
          id?: string
          title: string
          description: string
          organization_id: string
          program_id?: string
          start_date: string
          end_date: string
          location: string
          max_volunteers?: number
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
        }
        Update: {
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string
          max_volunteers?: number
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
        }
      }
      donations: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          amount: number
          currency: string
          type: 'one_time' | 'recurring'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          created_at: string
          transaction_id?: string
          notes?: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          amount: number
          currency: string
          type: 'one_time' | 'recurring'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string
          notes?: string
        }
        Update: {
          amount?: number
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string
          notes?: string
        }
      }
      certifications: {
        Row: {
          id: string
          name: string
          issuing_organization: string
          description: string
          validity_period?: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          issuing_organization: string
          description: string
          validity_period?: number
        }
        Update: {
          name?: string
          issuing_organization?: string
          description?: string
          validity_period?: number
        }
      }
      volunteer_certifications: {
        Row: {
          id: string
          volunteer_id: string
          certification_id: string
          issue_date: string
          expiry_date?: string
          status: 'active' | 'expired' | 'revoked'
          created_at: string
          document_url?: string
        }
        Insert: {
          id?: string
          volunteer_id: string
          certification_id: string
          issue_date: string
          expiry_date?: string
          status?: 'active' | 'expired' | 'revoked'
          document_url?: string
        }
        Update: {
          issue_date?: string
          expiry_date?: string
          status?: 'active' | 'expired' | 'revoked'
          document_url?: string
        }
      }
    }
    Views: {
      // Views will be added as needed
    }
    Functions: {
      // Functions will be added as needed
    }
  }
} 