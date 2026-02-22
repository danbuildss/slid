import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    let systemPrompt = ''

    switch (type) {
      case 'description':
        systemPrompt = `You are an invoice assistant. Generate a professional, concise invoice description (1-2 sentences max) based on the user's input. Only return the description, nothing else.

User input: ${prompt}`
        break

      case 'scope':
        systemPrompt = `You are a professional contract writer. Based on the service description, generate a clear scope of work (3-5 bullet points). Format as a simple list. Be concise and professional.

Service: ${prompt}`
        break

      case 'terms':
        systemPrompt = `You are a professional contract writer. Generate standard payment terms and conditions for a freelance invoice. Keep it brief (3-4 points). Include: payment timeline, revision policy, and any standard disclaimers.

Service type: ${prompt}`
        break

      case 'full':
        systemPrompt = `You are an invoice assistant. Based on this brief description, generate:
1. A professional invoice description (1 sentence)
2. Scope of work (3-4 bullet points)
3. Payment terms (2-3 points)

Format your response as JSON with keys: description, scope, terms

Brief: ${prompt}`
        break

      default:
        systemPrompt = prompt
    }

    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()

    // If it's a full generation, try to parse as JSON
    if (type === 'full') {
      try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          return NextResponse.json({ success: true, data: parsed })
        }
      } catch (e) {
        // If JSON parsing fails, return raw text
      }
    }

    return NextResponse.json({ success: true, text })
  } catch (error: any) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    )
  }
}
