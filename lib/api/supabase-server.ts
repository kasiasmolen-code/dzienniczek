/**
 * Server-side Supabase Helper Functions
 * Database operations with proper error handling
 */

import { createClient } from '@supabase/supabase-js'
import { Entry, Conversation, Message, Mood } from './types'

// Lazy initialize Supabase admin client
let adminClient: ReturnType<typeof createClient> | null = null

function getSupabaseAdmin() {
  if (adminClient) return adminClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return adminClient
}

/**
 * Create a new diary entry
 */
export async function createEntry(
  userId: string,
  data: {
    content: string
    title?: string
    date?: string
    mood?: Mood | null
    tags?: string[]
    image_url?: string | null
  }
): Promise<Entry> {
  const admin = getSupabaseAdmin() as any
  const now = new Date().toISOString()
  const today = new Date().toISOString().split('T')[0] + 'T00:00:00Z'

  const { data: entry, error } = await admin
    .from('entries')
    .insert({
      user_id: userId,
      content: data.content,
      title: data.title || 'Wpis',
      created_at: data.date || today,
      updated_at: now,
      mood: data.mood || null,
      tags: data.tags || [],
      image_url: data.image_url || null,
    })
    .select()
    .single()

  if (error) throw error
  return entry
}

/**
 * Get user's entries with filtering and pagination
 */
export async function getUserEntries(
  userId: string,
  options: {
    limit: number
    offset: number
    mood?: string
    tags?: string
    from_date?: string
    to_date?: string
    sort?: 'created_at' | 'updated_at'
    order?: 'asc' | 'desc'
  }
): Promise<{ entries: Entry[]; total: number }> {
  const admin = getSupabaseAdmin() as any

  let query = admin
    .from('entries')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)

  // Apply filters
  if (options.mood) {
    query = query.eq('mood', options.mood)
  }

  if (options.from_date) {
    query = query.gte('created_at', options.from_date)
  }

  if (options.to_date) {
    query = query.lte('created_at', options.to_date)
  }

  // Tags filtering
  if (options.tags) {
    const tagArray = options.tags.split(',').map((t) => t.trim())
    query = query.overlaps('tags', tagArray)
  }

  // Sorting
  const sortField = options.sort || 'created_at'
  const sortOrder = options.order === 'asc'
  query = query.order(sortField, { ascending: sortOrder })

  // Pagination
  query = query.range(options.offset, options.offset + options.limit - 1)

  const { data, count, error } = await query

  if (error) throw error

  return {
    entries: data || [],
    total: count || 0,
  }
}

/**
 * Get single entry by ID
 */
export async function getEntryById(userId: string, entryId: string): Promise<Entry | null> {
  const admin = getSupabaseAdmin() as any

  const { data, error } = await admin
    .from('entries')
    .select('*')
    .eq('id', entryId)
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found
  return data || null
}

/**
 * Create a new conversation
 */
export async function createConversation(
  userId: string,
  data: {
    entry_id?: string | null
    title?: string
  }
): Promise<Conversation> {
  const admin = getSupabaseAdmin() as any
  const now = new Date().toISOString()

  const { data: conversation, error } = await admin
    .from('conversations')
    .insert({
      user_id: userId,
      entry_id: data.entry_id || null,
      title: data.title || null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (error) throw error
  return conversation
}

/**
 * Get user's conversations with pagination
 */
export async function getUserConversations(
  userId: string,
  options: {
    limit: number
    offset: number
    sort?: 'created_at' | 'updated_at'
    order?: 'asc' | 'desc'
  }
): Promise<{ conversations: Conversation[]; total: number }> {
  const admin = getSupabaseAdmin() as any
  const sortField = options.sort || 'updated_at'
  const sortOrder = options.order === 'asc'

  const { data, count, error } = await admin
    .from('conversations')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order(sortField, { ascending: sortOrder })
    .range(options.offset, options.offset + options.limit - 1)

  if (error) throw error

  return {
    conversations: data || [],
    total: count || 0,
  }
}

/**
 * Get single conversation by ID
 */
export async function getConversationById(
  userId: string,
  conversationId: string
): Promise<Conversation | null> {
  const admin = getSupabaseAdmin() as any

  const { data, error } = await admin
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

/**
 * Update conversation title
 */
export async function updateConversationTitle(
  userId: string,
  conversationId: string,
  title: string
): Promise<Conversation> {
  const admin = getSupabaseAdmin() as any

  const { data, error } = await admin
    .from('conversations')
    .update({
      title,
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Save message to database
 */
export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<Message> {
  const admin = getSupabaseAdmin() as any

  const { data, error } = await admin
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Hybrid search entries using pgvector + full-text search (RRF fusion)
 */
export async function hybridSearchEntries(
  userId: string,
  queryEmbedding: number[],
  queryText: string,
  limit = 15
): Promise<Entry[]> {
  const admin = getSupabaseAdmin() as any

  const { data, error } = await admin.rpc('hybrid_search_entries', {
    p_user_id: userId,
    p_query_embedding: queryEmbedding,
    p_query_text: queryText,
    p_limit: limit,
  })

  if (error) throw error
  return (data || []) as Entry[]
}

/**
 * Update embedding for an entry
 */
export async function updateEntryEmbedding(
  entryId: string,
  embedding: number[]
): Promise<void> {
  const admin = getSupabaseAdmin() as any
  const { error } = await admin
    .from('entries')
    .update({ embedding })
    .eq('id', entryId)
  if (error) throw error
}

/**
 * Get messages from a conversation with pagination
 */
export async function getConversationMessages(
  userId: string,
  conversationId: string,
  options: {
    limit: number
    offset: number
  }
): Promise<{ messages: Message[]; total: number }> {
  const admin = getSupabaseAdmin() as any

  // First verify the conversation belongs to the user
  const conversation = await getConversationById(userId, conversationId)
  if (!conversation) {
    throw new Error('Conversation not found')
  }

  const { data, count, error } = await admin
    .from('messages')
    .select('*', { count: 'exact' })
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .range(options.offset, options.offset + options.limit - 1)

  if (error) throw error

  return {
    messages: data || [],
    total: count || 0,
  }
}
