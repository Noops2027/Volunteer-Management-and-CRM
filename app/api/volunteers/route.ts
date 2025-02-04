import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { VolunteerFilters, VolunteerStatus } from '@/types/volunteer'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filters: VolunteerFilters = {
      search: searchParams.get('search') || undefined,
      skills: searchParams.get('skills')?.split(','),
      availability: searchParams.get('availability')?.split(','),
      status: (searchParams.get('status') as VolunteerStatus) || undefined,
    }

    const supabase = createRouteHandlerClient({ cookies })
    
    let query = supabase
      .from('volunteers')
      .select('*')

    // Apply filters
    if (filters.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }

    if (filters.skills?.length) {
      query = query.contains('skills', filters.skills)
    }

    if (filters.availability?.length) {
      const availabilityConditions = filters.availability.map(a => `availability->>'${a}' = 'true'`)
      query = query.or(availabilityConditions.join(','))
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    const { data: volunteers, error } = await query
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(volunteers)
  } catch (error) {
    console.error('Error fetching volunteers:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  console.log('API route hit: POST /api/volunteers')
  
  try {
    const supabase = createRouteHandlerClient({ cookies })
    console.log('Supabase client created')
    
    // Get authenticated user
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    console.log('Auth session check:', { session: !!session, authError })
    
    if (authError || !session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get request body
    const volunteerData = await request.json()
    console.log('Received volunteer data:', volunteerData)
    
    // Insert volunteer with user_id
    console.log('Attempting to insert volunteer with user_id:', session.user.id)
    const { data, error } = await supabase
      .from('volunteers')
      .insert([{
        ...volunteerData,
        user_id: session.user.id
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    console.log('Volunteer created successfully:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 