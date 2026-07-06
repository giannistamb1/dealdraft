import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { Proposal, AgencySettings } from '@/lib/types'
import { PublicProposalView } from '@/components/PublicProposalView'

export default async function PublicProposalPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createServiceClient()

  // Get proposal by share token
  const { data: proposal, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('share_token', token)
    .single()

  if (error || !proposal) {
    notFound()
  }

  const proposalData = proposal as Proposal

  // Get agency settings
  const { data: settings } = await supabase
    .from('agency_settings')
    .select('*')
    .single()

  if (!settings) {
    notFound()
  }

  const agencySettings = settings as AgencySettings

  // Log first view
  if (!proposalData.client_viewed_at) {
    await supabase
      .from('proposals')
      .update({ client_viewed_at: new Date().toISOString() })
      .eq('id', proposalData.id)

    await supabase.from('activity').insert({
      proposal_id: proposalData.id,
      event: 'link_opened',
      meta: {},
    })
  }

  return (
    <PublicProposalView
      proposal={proposalData}
      settings={agencySettings}
    />
  )
}
