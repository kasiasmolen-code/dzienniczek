/**
 * GET /api/entries/:id - Get single entry
 */

import { verifyAuth, handleApiError } from '@/lib/api/middleware'
import { getEntryById } from '@/lib/api/supabase-server'
import { ApiError, ApiResponse, Entry } from '@/lib/api/types'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyAuth(req)
    const { id: entryId } = await params

    const entry = await getEntryById(userId, entryId)

    if (!entry) {
      throw new ApiError('Entry not found', 'NOT_FOUND', 404)
    }

    return Response.json(
      { data: entry } as ApiResponse<Entry>,
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
