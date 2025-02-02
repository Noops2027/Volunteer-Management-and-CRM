export interface Database {
  public: {
    Tables: {
      volunteer_profiles: {
        Row: {
          id: string
          user_id: string
          availability: string
          interests: string
          emergency_contact: string
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          availability?: string
          interests?: string
          emergency_contact?: string
          created_at?: string
          status?: string
        }
        Update: {
          id?: string
          user_id?: string
          availability?: string
          interests?: string
          emergency_contact?: string
          created_at?: string
          status?: string
        }
      }
      appointments: {
        Row: {
          id: string
          title: string
          description: string
          start_time: string
          end_time: string
          type_id: string
          status: string
          location: string
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
          status?: string
          location?: string
          created_at?: string
          created_by: string
          organization_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_time?: string
          end_time?: string
          type_id?: string
          status?: string
          location?: string
          created_at?: string
          created_by?: string
          organization_id?: string
        }
      }
      // Add other tables as needed...
    }
  }
} 