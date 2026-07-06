import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { rewriteSection } from '@/lib/ai/rewrite'
import { AgencySettings, Proposal } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { proposalId, sectionIndex, instruction } = body

    if (!proposalId || sectionIndex === undefined || !instruction) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()

    // Get proposal
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single()

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    const proposalData = proposal as Proposal

    // Get agency settings
    const { data: settings, error: settingsError } = await supabase
      .from('agency_settings')
      .select('*')
      .single()

    if (settingsError || !settings) {
      return NextResponse.json(
        { error: 'Agency settings not found' },
        { status: 500 }
      )
    }

    const agencySettings = settings as AgencySettings

    // Rewrite section
    const section = proposalData.sections[sectionIndex]
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    const newContent = await rewriteSection(agencySettings, section, instruction)

    return NextResponse.json({ content: newContent })
  } catch (error) {
    console.error('Rewrite error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
