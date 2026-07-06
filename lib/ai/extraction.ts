import Anthropic from '@anthropic-ai/sdk'
import { Extraction } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function extractFromTranscript(transcript: string): Promise<Extraction> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are analyzing a sales call transcript. Extract structured information from it.

CRITICAL RULES:
- Only extract what is actually supported by the transcript
- For pain points, include verbatim quotes from the transcript
- Mark anything inferred as "inferred: true"
- Never invent budget numbers
- If something is not mentioned, omit it or leave it empty

Return a JSON object with this exact structure:
{
  "client_name": "string or null",
  "client_company": "string or null",
  "industry": "string or null",
  "pain_points": [
    {
      "point": "description of pain point",
      "quote": "exact quote from transcript",
      "inferred": false
    }
  ],
  "goals": ["goal 1", "goal 2"],
  "scope_signals": ["feature 1", "feature 2"],
  "budget_signals": "description of budget mentioned or null",
  "timeline_signals": "description of timeline mentioned or null",
  "objections": ["objection 1", "objection 2"],
  "decision_makers": ["name 1", "name 2"],
  "next_step_agreed": "string or null"
}

TRANSCRIPT:
${transcript}

Return ONLY the JSON object, no other text.`,
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
