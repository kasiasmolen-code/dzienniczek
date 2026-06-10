/**
 * POST /api/entries - Create new diary entry
 * GET /api/entries - List user's entries
 */

import { verifyAuth, handleApiError, validateBody, validateQuery } from '@/lib/api/middleware'
import { createEntrySchema, listEntriesSchema } from '@/lib/api/validators'
import { createEntry, getUserEntries, updateEntryEmbedding } from '@/lib/api/supabase-server'
import { generateEmbedding, buildEmbeddingText } from '@/lib/api/embeddings'
import { ApiResponse } from '@/lib/api/types'
import { Entry } from '@/lib/api/types'

// POST - Create entry
export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req)
    const validated = await validateBody(req, createEntrySchema)

    const entry = await createEntry(userId, validated)

    // Generate and store embedding asynchronously (don't block response)
    generateEmbedding(buildEmbeddingText(entry))
      .then((embedding) => updateEntryEmbedding(entry.id, embedding))
      .catch((err) => console.error('[embedding] failed for entry', entry.id, err))

    return Response.json(
      { data: entry } as ApiResponse<Entry>,
      { status: 201 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// GET - List entries
export async function GET(req: Request) {
  try {
    const userId = await verifyAuth(req)
    const query = validateQuery(req, listEntriesSchema)

    const { entries, total } = await getUserEntries(userId, query)

    const hasMore = query.offset + entries.length < total

    return Response.json(
      {
        data: entries,
        pagination: {
          limit: query.limit,
          offset: query.offset,
          total,
          hasMore,
        },
      } as ApiResponse<Entry[]>,
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
