import type { Context } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

// Uses Netlify AI Gateway - no API key setup required, billed to Netlify account credits.
// Haiku + a small max_tokens cap keeps each request cheap.
const anthropic = new Anthropic()

function generateTutorPrompt(topic: string): string {
  return `You are a German language tutor for the Germanbuddy application.

Explain this topic in simple language.

Topic:
${topic}

Return:
1. Explanation (clear and beginner-friendly)
2. German Examples (with context)
3. English Translation (of examples)
4. Learning Tip (memory aid or helpful hint)

Keep the response short, beginner friendly and structured.`
}

async function explain(topic: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 500,
    messages: [{ role: 'user', content: generateTutorPrompt(topic) }],
  })

  const block = message.content[0]
  const explanation = block && block.type === 'text' ? block.text : ''

  if (!explanation) {
    throw new Error('AI Gateway returned an empty response')
  }

  return explanation
}

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  let body: { topic?: unknown }

  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Request body must be valid JSON' }, { status: 400 })
  }

  const topic = typeof body.topic === 'string' ? body.topic.trim() : ''

  if (!topic) {
    return Response.json({ error: 'Topic is required' }, { status: 400 })
  }

  try {
    const explanation = await explain(topic)
    return Response.json({ success: true, explanation })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Germanbuddy] AI tutor request failed:', errorMsg)
    return Response.json(
      { error: 'AI tutor is not available right now. Please try again shortly.' },
      { status: 503 },
    )
  }
}

export const config = {
  path: '/api/ai/explain',
}
