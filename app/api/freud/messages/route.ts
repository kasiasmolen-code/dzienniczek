/**
 * POST /api/freud/messages - Send message to Freud (streams response)
 * GET /api/freud/messages - Get messages from conversation
 */

import { verifyAuth, handleApiError, validateBody, validateQuery } from '@/lib/api/middleware'
import { sendMessageSchema, getMessagesSchema } from '@/lib/api/validators'
import {
  getConversationById,
  getConversationMessages,
  saveMessage,
  updateConversationTitle,
  getUserEntries,
  hybridSearchEntries,
} from '@/lib/api/supabase-server'
import { generateEmbedding } from '@/lib/api/embeddings'
import { ApiError, ApiResponse, Message } from '@/lib/api/types'

// POST - Send message to Freud (streams response)
export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req)
    const validated = await validateBody(req, sendMessageSchema)

    // Verify conversation exists and belongs to user
    const conversation = await getConversationById(userId, validated.conversation_id)
    if (!conversation) {
      throw new ApiError('Conversation not found', 'NOT_FOUND', 404)
    }

    // Save user message
    await saveMessage(validated.conversation_id, 'user', validated.content)

    // Update conversation title if it's the first message and no title set
    if (!conversation.title) {
      const title = validated.content.substring(0, 50).trim()
      await updateConversationTitle(userId, validated.conversation_id, title)
    }

    // Get user's entries for context (Freud needs them) + hybrid search in parallel
    const [{ entries }, queryEmbedding] = await Promise.all([
      getUserEntries(userId, { limit: 50, offset: 0, sort: 'created_at', order: 'desc' }),
      generateEmbedding(validated.content).catch((err) => {
        console.error('[hybrid search] embedding failed:', err)
        return null
      }),
    ])

    // Run hybrid search if embedding succeeded (skip gracefully if OpenAI is unavailable)
    const relevantEntries = queryEmbedding
      ? await hybridSearchEntries(userId, queryEmbedding, validated.content, 15).catch((err) => {
          console.error('[hybrid search] search failed:', err)
          return []
        })
      : []

    // Get messages from current conversation (excluding the one we just saved)
    const { messages: conversationMessages } = await getConversationMessages(userId, validated.conversation_id, {
      limit: 100,
      offset: 0,
    })

    // Convert messages to format expected by /api/chat
    const formattedMessages = conversationMessages
      .filter((m) => m.id !== undefined) // Only include saved messages
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    // Forward to existing /api/chat endpoint for streaming
    const chatResponse = await fetch(new URL('/api/chat', req.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: formattedMessages,
        entries,
        activeEntry: conversation.entry_id ? entries.find((e) => e.id === conversation.entry_id) : null,
        relevantEntries,
      }),
    })

    if (!chatResponse.ok) {
      throw new ApiError('Failed to get response from Freud', 'FREUD_ERROR', 500)
    }

    // Stream the response back and save assistant message when done
    const reader = chatResponse.body?.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader?.read() || {}
            if (done) break

            const chunk = decoder.decode(value)
            fullResponse += chunk
            controller.enqueue(new TextEncoder().encode(chunk))
          }

          // Save assistant's full response to database
          if (fullResponse) {
            await saveMessage(validated.conversation_id, 'assistant', fullResponse)
          }

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// GET - Get messages from conversation
export async function GET(req: Request) {
  try {
    const userId = await verifyAuth(req)
    const query = validateQuery(req, getMessagesSchema)

    const { messages, total } = await getConversationMessages(userId, query.conversation_id, {
      limit: query.limit,
      offset: query.offset,
    })

    const hasMore = query.offset + messages.length < total

    return Response.json(
      {
        data: messages,
        pagination: {
          limit: query.limit,
          offset: query.offset,
          total,
          hasMore,
        },
      } as ApiResponse<Message[]>,
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
