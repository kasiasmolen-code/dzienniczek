/**
 * API Types and Error Handling
 * Standardized types for all API endpoints
 */

export interface ApiResponse<T> {
  data: T
  pagination?: {
    limit: number
    offset: number
    total: number
    hasMore: boolean
  }
}

export interface ApiErrorResponse {
  error: string
  code: string
  details?: unknown
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Request/Response Types

export interface CreateEntryRequest {
  content: string
  title?: string
  date?: string // ISO8601 format, defaults to today
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible' | null
  tags?: string[]
}

export interface ListEntriesQuery {
  limit?: number
  offset?: number
  mood?: string
  tags?: string
  from_date?: string
  to_date?: string
  sort?: 'created_at' | 'updated_at'
  order?: 'asc' | 'desc'
}

export interface CreateConversationRequest {
  entry_id?: string | null
  title?: string
}

export interface SendMessageRequest {
  conversation_id: string
  content: string
}

export interface GetMessagesQuery {
  conversation_id: string
  limit?: number
  offset?: number
}

// Database Types (re-exported from main types)
export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible'

export interface Entry {
  id: string
  user_id: string
  title: string
  content: string
  mood: Mood | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string | null
  entry_id: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
