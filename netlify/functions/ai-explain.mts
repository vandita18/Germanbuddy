import type { Context } from '@netlify/functions'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({})

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { topic } = await req.json()

  if (!topic) {
    return Response.json({ error: 'Topic is required' }, { status: 400 })
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

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: prompt,
  })

  return Response.json({
    success: true,
    explanation: response.text,
  })
}

export const config = {
  path: '/api/ai/explain',
}
