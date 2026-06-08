/**
 * POST /api/freud/conversations - Create new conversation
 * GET /api/freud/conversations - List user's conversations
 */

import { verifyAuth, handleApiError, validateBody, validateQuery } from '@/lib/api/middleware'
import { createConversationSchema, listConversationsSchema } from '@/lib/api/validators'
import { createConversation, getUserConversations } from '@/lib/api/supabase-server'
import { ApiResponse, Conversation } from '@/lib/api/types'

// POST - Create conversation
export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req)
    const validated = await validateBody(req, createConversationSchema)

    const conversation = await createConversation(userId, validated)

    return Response.json(
      { data: conversation } as ApiResponse<Conversation>,
      { status: 201 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// GET - List conversations
export async function GET(req: Request) {
  try {
    const userId = await verifyAuth(req)
    const query = validateQuery(req, listConversationsSchema)

    const { conversations, total } = await getUserConversations(userId, query)

    const hasMore = query.offset + conversations.length < total

    return Response.json(
      {
        data: conversations,
        pagination: {
          limit: query.limit,
          offset: query.offset,
          total,
          hasMore,
        },
      } as ApiResponse<Conversation[]>,
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
