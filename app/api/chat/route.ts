import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { buildSystemPrompt } from '@/lib/freud-prompt'
import { generateEmbedding } from '@/lib/api/embeddings'
import { hybridSearchEntries } from '@/lib/api/supabase-server'
import { verifyAuth, handleApiError } from '@/lib/api/middleware'
import type { Entry } from '@/lib/types'

export async function POST(req: Request) {
  try {
    // Tożsamość bierzemy WYŁĄCZNIE z tokenu zalogowanego użytkownika,
    // nigdy z body — inaczej można by podać cudze userId i czytać cudze wpisy.
    const userId = await verifyAuth(req)

    const { messages, entries, activeEntry, therapistSystemPrompt } = await req.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[]
      entries: Entry[]
      activeEntry?: Entry | null
      therapistSystemPrompt?: string | null
    }

    // Run hybrid search using the last user message
    let relevantEntries: Entry[] = []
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user' && m.content !== '__init__')
    if (lastUserMsg) {
      try {
        const embedding = await generateEmbedding(lastUserMsg.content)
        relevantEntries = await hybridSearchEntries(userId, embedding, lastUserMsg.content, 15)
      } catch (err) {
        console.error('[hybrid search] failed:', err)
      }
    }

    const systemPrompt = buildSystemPrompt(entries, activeEntry, relevantEntries, therapistSystemPrompt)

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
    return handleApiError(error)
  }
}
