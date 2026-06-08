/**
 * API Middleware
 * Authentication, validation, and error handling
 */

import { createClient } from '@supabase/supabase-js'
import { ApiError, ApiErrorResponse } from './types'

// Lazy initialize Supabase admin client
let supabaseAdmin: ReturnType<typeof createClient> | null = null

function getSupabaseAdmin() {
  if (supabaseAdmin) return supabaseAdmin

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return supabaseAdmin
}

export { getSupabaseAdmin as supabaseAdmin }

/**
 * Verify JWT token and extract user ID
 * Throws ApiError if token is invalid or missing
 */
export async function verifyAuth(req: Request): Promise<string> {
  const authHeader = req.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(
      'Missing or invalid authorization header',
      'UNAUTHORIZED',
      401
    )
  }

  const token = authHeader.slice(7)

  try {
    // Verify token with Supabase
    const admin = getSupabaseAdmin()
    const { data, error } = await admin.auth.getUser(token)

    if (error || !data.user?.id) {
      throw new ApiError('Invalid or expired token', 'UNAUTHORIZED', 401)
    }

    return data.user.id
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new ApiError('Failed to verify token', 'UNAUTHORIZED', 401)
  }
}

/**
 * Parse and validate pagination parameters from URL
 */
export function parsePaginationParams(req: Request): {
  limit: number
  offset: number
} {
  const url = new URL(req.url)
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '20'), 1), 100)
  const offset = Math.max(parseInt(url.searchParams.get('offset') || '0'), 0)

  return { limit, offset }
}

/**
 * Format error response
 */
export function handleApiError(error: unknown): Response {
  let apiError: ApiError

  if (error instanceof ApiError) {
    apiError = error
  } else if (error instanceof Error) {
    console.error('Unexpected error:', error.message)
    apiError = new ApiError('Internal server error', 'INTERNAL_ERROR', 500)
  } else {
    console.error('Unknown error:', error)
    apiError = new ApiError('Internal server error', 'INTERNAL_ERROR', 500)
  }

  const response: ApiErrorResponse = {
    error: apiError.message,
    code: apiError.code,
  }

  if (apiError.details) {
    response.details = apiError.details
  }

  return Response.json(response, { status: apiError.statusCode })
}

/**
 * Validate request body against a Zod schema
 */
export async function validateBody<T>(
  req: Request,
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  try {
    const body = await req.json()
    return schema.parse(body)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request body'
    throw new ApiError(message, 'VALIDATION_ERROR', 400, err)
  }
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQuery<T>(
  req: Request,
  schema: { parse: (data: unknown) => T }
): T {
  try {
    const url = new URL(req.url)
    const params = Object.fromEntries(url.searchParams)
    return schema.parse(params)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid query parameters'
    throw new ApiError(message, 'VALIDATION_ERROR', 400, err)
  }
}
