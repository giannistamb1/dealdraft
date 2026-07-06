import Anthropic from '@anthropic-ai/sdk'
import { AgencySettings, ProposalSection } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function rewriteSection(
  settings: AgencySettings,
  section: ProposalSection,
  instruction: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: `You are editing a proposal section for ${settings.name}.

TONE INSTRUCTIONS:
${settings.tone_instructions || 'Professional and clear.'}

You will receive a section and an instruction for how to rewrite it. Return ONLY the rewritten markdown content, no other text or explanation.`,
    messages: [
      {
        role: 'user',
        content: `CURRENT SECTION CONTENT:
${section.content_md}

INSTRUCTION:
${instruction}

Rewrite the section following the instruction while maintaining the agency's tone. Return ONLY the new markdown content.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return content.text.trim()
}
