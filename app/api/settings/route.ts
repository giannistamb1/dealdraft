import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { AgencySettings } from '@/lib/types'

export async function GET() {
  try {
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('agency_settings')
      .select('*')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    return NextResponse.json(data as AgencySettings)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createServiceClient()

    // Get the existing settings to get the ID
    const { data: existing } = await supabase
      .from('agency_settings')
      .select('id')
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('agency_settings')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
