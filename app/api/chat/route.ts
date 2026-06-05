import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { buildSystemPrompt } from '@/lib/freud-prompt'
import type { Entry } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const { messages, entries, activeEntry } = await req.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[]
      entries: Entry[]
      activeEntry?: Entry | null
    }

    const systemPrompt = buildSystemPrompt(entries, activeEntry)

    const result = streamText({
      model: anthropic('claude-sonnet-4-6'),
      system: systemPrompt,
      messages,
      maxTokens: 1024,
      onError: ({ error }) => console.error('[streamText error]', error),
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('[/api/chat]', error)
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
  }
}
