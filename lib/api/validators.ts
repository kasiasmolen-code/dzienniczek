/**
 * Request Validation Schemas
 * Zod schemas for all API endpoints
 */

import { z } from 'zod'

// Mood enum
const moodEnum = z.enum(['great', 'good', 'neutral', 'bad', 'terrible']).nullable().optional()

// ===== ENTRY SCHEMAS =====

export const createEntrySchema = z.object({
  content: z.string().min(1, 'Content is required').max(50000, 'Content is too long'),
  title: z.string().max(200, 'Title is too long').optional(),
  date: z.string().datetime('Invalid date format').optional(), // ISO8601
  mood: moodEnum,
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags allowed').optional(),
  image_url: z.string().max(500).nullable().optional(), // ścieżka pliku w buckecie (nie URL)
})

export type CreateEntryRequest = z.infer<typeof createEntrySchema>

export const listEntriesSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  mood: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  sort: z.enum(['created_at', 'updated_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type ListEntriesQuery = z.infer<typeof listEntriesSchema>

// ===== CONVERSATION SCHEMAS =====

export const createConversationSchema = z.object({
  entry_id: z.string().uuid().optional().nullable(),
  title: z.string().max(200).optional(),
})

export type CreateConversationRequest = z.infer<typeof createConversationSchema>

export const listConversationsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sort: z.enum(['created_at', 'updated_at']).default('updated_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type ListConversationsQuery = z.infer<typeof listConversationsSchema>

// ===== MESSAGE SCHEMAS =====

export const sendMessageSchema = z.object({
  conversation_id: z.string().uuid('Invalid conversation ID'),
  content: z.string().min(1, 'Message is required').max(10000, 'Message is too long'),
})

export type SendMessageRequest = z.infer<typeof sendMessageSchema>

export const getMessagesSchema = z.object({
  conversation_id: z.string().uuid('Invalid conversation ID'),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

export type GetMessagesQuery = z.infer<typeof getMessagesSchema>
