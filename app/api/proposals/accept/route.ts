import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { shareToken } = body

    if (!shareToken) {
      return NextResponse.json({ error: 'Share token required' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // Get proposal
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id, accepted_at')
      .eq('share_token', shareToken)
      .single()

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    if (proposal.accepted_at) {
      return NextResponse.json({ error: 'Proposal already accepted' }, { status: 400 })
    }

    // Update proposal
    const acceptedAt = new Date().toISOString()
    const { error: updateError } = await supabase
      .from('proposals')
      .update({
        status: 'accepted',
        accepted_at: acceptedAt,
      })
      .eq('share_token', shareToken)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity').insert({
      proposal_id: proposal.id,
      event: 'accepted',
      meta: { accepted_at: acceptedAt },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
