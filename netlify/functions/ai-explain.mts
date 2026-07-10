import type { Context } from '@netlify/functions'

const MODEL = 'gpt-4.1-mini'

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

  const env = (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> }
  }).process?.env

  const baseUrl = env?.NETLIFY_AI_GATEWAY_BASE_URL
  const apiKey = env?.NETLIFY_AI_GATEWAY_KEY

  if (!baseUrl || !apiKey) {
    console.error('Netlify AI Gateway environment variables are unavailable')
    return Response.json(
      { error: 'AI tutor is not available in this environment' },
      { status: 503 },
    )
  }

  const prompt = `You are a German language tutor.

Explain this topic in simple language.

Topic:
${topic}

Return:
1. Explanation
2. German Examples
3. English Translation
4. Learning Tip

Keep response beginner friendly.`

  try {
    const response = await fetch(`${baseUrl}/openai/v1/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI Gateway request failed', response.status, errorText)
      return Response.json(
        { error: 'AI tutor could not generate a response' },
        { status: 502 },
      )
    }

    const data = await response.json()
    const explanation = data?.choices?.[0]?.message?.content

    if (typeof explanation !== 'string' || !explanation.trim()) {
      console.error('AI Gateway returned an empty explanation')
      return Response.json(
        { error: 'AI tutor returned an empty response' },
        { status: 502 },
      )
    }

    return Response.json({
      success: true,
      explanation,
    })
  } catch (error) {
    console.error('AI tutor request failed', error)
    return Response.json(
      { error: 'AI tutor could not be reached' },
      { status: 502 },
    )
  }
}

export const config = {
  path: '/api/ai/explain',
}
