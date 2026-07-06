import Anthropic from '@anthropic-ai/sdk'
import { AgencySettings, Extraction, ProposalSection, PricingItem } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface GenerationResult {
  sections: ProposalSection[]
  pricing: PricingItem[]
}

export async function generateProposal(
  settings: AgencySettings,
  extraction: Extraction,
  transcript: string
): Promise<GenerationResult> {
  const systemPrompt = buildSystemPrompt(settings)

  const userContent = `EXTRACTION FROM CALL:
${JSON.stringify(extraction, null, 2)}

FULL TRANSCRIPT:
${transcript}

Generate a complete proposal following the template sections and tone instructions provided in the system prompt. Return ONLY a JSON object with this structure:

{
  "sections": [
    {
      "key": "section_key",
      "title": "Section Title",
      "content_md": "Markdown content here"
    }
  ],
  "pricing": [
    {
      "item": "Item name",
      "description": "Item description",
      "qty": 1,
      "unit_price": 10000,
      "total": 10000
    }
  ]
}

CRITICAL RULES:
- Mirror the client's vocabulary from the transcript in "Understanding Your Situation"
- Quote their pain points where relevant
- Only include scope items from scope_signals and the agency's service list
- If budget signals exist, anchor pricing near them; otherwise use price_from values
- Keep every section under 150 words except Scope & Deliverables
- Write in the agency's tone_instructions voice
- Address objections implicitly in "Proposed Approach" without naming them
- Include ALL enabled template sections
- Use the client's name (${extraction.client_name || 'the client'}) where appropriate`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userContent,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  // Parse the JSON response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from Claude response')
  }

  return JSON.parse(jsonMatch[0])
}

function buildSystemPrompt(settings: AgencySettings): string {
  const enabledSections = settings.template_sections.filter(s => s.enabled)

  return `You are writing a proposal for ${settings.name}.

AGENCY INFORMATION:
- Name: ${settings.name}
- About: ${settings.about_blurb || 'N/A'}
- Website: ${settings.website || 'N/A'}
- Currency: ${settings.currency}

TONE INSTRUCTIONS:
${settings.tone_instructions || 'Professional and clear.'}

SERVICES OFFERED:
${settings.services.map(s => `- ${s.name}: ${s.description} (from ${settings.currency}${s.price_from}/${s.unit})`).join('\n')}

TEMPLATE SECTIONS (generate these in order):
${enabledSections.map(s => `
${s.title}
Key: ${s.key}
Instructions: ${s.instructions}
`).join('\n---\n')}

DEFAULT TERMS:
${settings.default_terms || 'Standard terms apply.'}

Write the proposal as if you ARE ${settings.name}. Use "we" and "our". Follow the tone instructions precisely.`
}
