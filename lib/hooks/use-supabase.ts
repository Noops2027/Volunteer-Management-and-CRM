import { useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useVolunteers() {
  const getVolunteers = useCallback(async () => {
    const { data, error } = await supabase
      .from('volunteer_profiles')
      .select(`
        *,
        users (*)
      `)
    
    if (error) throw error
    return data
  }, [])

  return { getVolunteers }
}

export function useAppointments() {
  const getAppointments = useCallback(async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        appointment_types (*),
        appointment_participants (*)
      `)
    
    if (error) throw error
    return data
  }, [])

  return { getAppointments }
} 