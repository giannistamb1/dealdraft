import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { extractFromTranscript } from '@/lib/ai/extraction'
import { generateProposal } from '@/lib/ai/generation'
import { AgencySettings } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transcript, client_name, client_company, source_label } = body

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()

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

    // Step 1: Extract from transcript
    const extraction = await extractFromTranscript(transcript)

    // Use extracted or provided client info
    const finalClientName = client_name || extraction.client_name
    const finalClientCompany = client_company || extraction.client_company

    // Insert call record
    const { data: call, error: callError } = await supabase
      .from('calls')
      .insert({
        client_name: finalClientName,
        client_company: finalClientCompany,
        transcript,
        source_label,
        extraction,
      })
      .select()
      .single()

    if (callError || !call) {
      console.error('Call insert error:', callError)
      return NextResponse.json(
        { error: 'Failed to save call' },
        { status: 500 }
      )
    }

    // Step 2: Generate proposal
    const generated = await generateProposal(agencySettings, extraction, transcript)

    // Create proposal title
    const proposalTitle = finalClientCompany
      ? `${finalClientCompany} — Proposal`
      : finalClientName
      ? `Proposal for ${finalClientName}`
      : 'Sales Proposal'

    // Insert proposal
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .insert({
        call_id: call.id,
        title: proposalTitle,
        status: 'draft',
        sections: generated.sections,
        pricing: generated.pricing,
        valid_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      .select()
      .single()

    if (proposalError || !proposal) {
      console.error('Proposal insert error:', proposalError)
      return NextResponse.json(
        { error: 'Failed to create proposal' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity').insert({
      proposal_id: proposal.id,
      event: 'created',
      meta: { source: 'ai_generation' },
    })

    return NextResponse.json({ proposalId: proposal.id })
  } catch (error) {
    console.error('Generate proposal error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
