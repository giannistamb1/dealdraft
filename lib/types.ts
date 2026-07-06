export interface AgencySettings {
  id: string
  name: string
  logo_url?: string
  primary_color: string
  secondary_color: string
  website?: string
  about_blurb?: string
  tone_instructions?: string
  services: Service[]
  template_sections: TemplateSection[]
  default_terms?: string
  currency: string
  created_at: string
  updated_at: string
}

export interface Service {
  name: string
  description: string
  price_from: number
  unit: string
}

export interface TemplateSection {
  key: string
  title: string
  instructions: string
  enabled: boolean
}

export interface Call {
  id: string
  client_name?: string
  client_company?: string
  transcript: string
  source_label?: string
  extraction?: Extraction
  created_at: string
}

export interface Extraction {
  client_name?: string
  client_company?: string
  industry?: string
  pain_points: PainPoint[]
  goals: string[]
  scope_signals: string[]
  budget_signals?: string
  timeline_signals?: string
  objections: string[]
  decision_makers: string[]
  next_step_agreed?: string
}

export interface PainPoint {
  point: string
  quote: string
  inferred: boolean
}

export interface Proposal {
  id: string
  call_id?: string
  title: string
  status: 'draft' | 'sent' | 'accepted' | 'declined'
  sections: ProposalSection[]
  pricing: PricingItem[]
  valid_until?: string
  share_token: string
  client_viewed_at?: string
  accepted_at?: string
  created_at: string
  updated_at: string
}

export interface ProposalSection {
  key: string
  title: string
  content_md: string
}

export interface PricingItem {
  item: string
  description: string
  qty: number
  unit_price: number
  total: number
}

export interface Activity {
  id: string
  proposal_id: string
  event: 'created' | 'exported' | 'link_opened' | 'accepted'
  meta: Record<string, any>
  created_at: string
}
