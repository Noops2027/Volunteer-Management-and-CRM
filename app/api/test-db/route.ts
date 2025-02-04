import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Test the connection
    const { data, error } = await supabase
      .from('volunteers')
      .select('count')
      .limit(1)

    if (error) throw error

    return NextResponse.json({ message: 'Database connection successful', data })
  } catch (error) {
    console.error('Database connection test failed:', error)
    return NextResponse.json(
      { message: 'Database connection failed', error },
      { status: 500 }
    )
  }
} 