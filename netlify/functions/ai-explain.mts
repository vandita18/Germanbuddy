import type { Context } from '@netlify/functions'

// =====================
// 1. Google Gemini API (Primary)
// =====================
const useGeminiAPI = async (topic: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured')
  }

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: generateTutorPrompt(topic),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    }),
    signal: AbortSignal.timeout(30000),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const explanation = data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!explanation) {
    throw new Error('Gemini API returned empty response')
  }

  return explanation
}

// =====================
// 2. OpenAI API
// =====================
const useOpenAIAPI = async (topic: string): Promise<string> => {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a German language tutor for Germanbuddy. Provide clear, beginner-friendly explanations.',
        },
        {
          role: 'user',
          content: generateTutorPrompt(topic),
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
    signal: AbortSignal.timeout(30000),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const explanation = data?.choices?.[0]?.message?.content

  if (!explanation) {
    throw new Error('OpenAI API returned empty response')
  }

  return explanation
}

// =====================
// 3. Anthropic Claude API
// =====================
const useAnthropicAPI = async (topic: string): Promise<string> => {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: generateTutorPrompt(topic),
        },
      ],
    }),
    signal: AbortSignal.timeout(30000),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const explanation = data?.content?.[0]?.text

  if (!explanation) {
    throw new Error('Anthropic API returned empty response')
  }

  return explanation
}

// =====================
// Helper Functions
// =====================

/**
 * Generate consistent tutor prompt for all AI providers
 */
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

Keep response beginner friendly and structured.`
}

/**
 * Fallback mechanism - try providers in order
 * Default order: Gemini → OpenAI → Anthropic
 */
async function explainWithFallback(
  topic: string,
  providers: string[] = ['gemini', 'openai', 'anthropic'],
): Promise<string> {
  console.log(`[Germanbuddy] Explaining topic: "${topic}"`)
  console.log(`[Germanbuddy] Trying providers: ${providers.join(', ')}`)

  const errors: Record<string, string> = {}

  for (const provider of providers) {
    try {
      switch (provider.toLowerCase()) {
        case 'gemini':
          console.log('[Germanbuddy] Attempting Gemini API...')
          return await useGeminiAPI(topic)
        case 'openai':
          console.log('[Germanbuddy] Attempting OpenAI API...')
          return await useOpenAIAPI(topic)
        case 'anthropic':
          console.log('[Germanbuddy] Attempting Anthropic API...')
          return await useAnthropicAPI(topic)
        default:
          console.warn(`[Germanbuddy] Unknown provider: ${provider}`)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.warn(`[Germanbuddy] ${provider} failed: ${errorMsg}`)
      errors[provider] = errorMsg
      continue
    }
  }

  // All providers failed
  const errorDetails = Object.entries(errors)
    .map(([provider, error]) => `${provider}: ${error}`)
    .join('; ')
  throw new Error(`[Germanbuddy] All AI providers failed. Details: ${errorDetails}`)
}

// =====================
// Main Handler
// =====================

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
    console.log(`[Germanbuddy] Processing AI explain request for topic: "${topic}"`)
    const explanation = await explainWithFallback(topic)

    if (typeof explanation !== 'string' || !explanation.trim()) {
      console.error('[Germanbuddy] AI service returned an empty explanation')
      return Response.json({ error: 'AI tutor returned an empty response' }, { status: 502 })
    }

    return Response.json({
      success: true,
      explanation,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Germanbuddy] AI tutor request failed:', errorMsg)
    return Response.json(
      { error: 'AI tutor is not available in this environment' },
      { status: 503 },
    )
  }
}

export const config = {
  path: '/api/ai/explain',
}
