import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Proposal, Call, AgencySettings } from '@/lib/types'
import { ProposalEditor } from '@/components/ProposalEditor'

export default async function ProposalEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Get proposal with call data
  const { data: proposal, error } = await supabase
    .from('proposals')
    .select('*, calls(*)')
    .eq('id', id)
    .single()

  if (error || !proposal) {
    notFound()
  }

  const proposalData = proposal as Proposal & { calls: Call }

  // Get agency settings
  const { data: settings } = await supabase
    .from('agency_settings')
    .select('*')
    .single()

  if (!settings) {
    redirect('/settings')
  }

  const agencySettings = settings as AgencySettings

  return (
    <ProposalEditor
      proposal={proposalData}
      call={proposalData.calls}
      settings={agencySettings}
    />
  )
}
