import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Proposal, AgencySettings } from '@/lib/types'
import { generatePDF } from '@/lib/pdf/generator'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServiceClient()

    // Get proposal
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
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

    // Generate PDF
    const pdfBuffer = await generatePDF(proposalData, agencySettings)

    // Log activity
    await supabase.from('activity').insert({
      proposal_id: proposalData.id,
      event: 'exported',
      meta: { format: 'pdf' },
    })

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${proposalData.title}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
