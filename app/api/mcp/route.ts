import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { z } from 'zod'
import { NextRequest } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dzienniczek-katarzyna-smolen-projects.vercel.app'

function createMcpServer(token: string | undefined) {
  const server = new McpServer({ name: 'dzienniczek', version: '1.0.0' })

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  async function apiFetch(path: string, init?: RequestInit) {
    const res = await fetch(`${BASE_URL}/api${path}`, { ...init, headers: { ...headers, ...(init?.headers as Record<string, string> ?? {}) } })
    return res.json()
  }

  // ── Entries ──────────────────────────────────────────────────────────────────

  server.tool('create_entry', 'Utwórz nowy wpis w dzienniku użytkownika', {
    content: z.string().describe('Treść wpisu (wymagane)'),
    title: z.string().optional().describe('Tytuł wpisu'),
    mood: z.enum(['great', 'good', 'neutral', 'bad', 'terrible']).optional(),
    tags: z.array(z.string()).optional().describe('Tagi (max 10)'),
  }, async (params) => {
    const data = await apiFetch('/entries', { method: 'POST', body: JSON.stringify(params) })
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
  })

  server.tool('list_entries', 'Pobierz listę wpisów użytkownika', {
    limit: z.number().optional(),
    offset: z.number().optional(),
    mood: z.enum(['great', 'good', 'neutral', 'bad', 'terrible']).optional(),
  }, async (params) => {
    const q = new URLSearchParams()
    if (params.limit) q.set('limit', String(params.limit))
    if (params.offset) q.set('offset', String(params.offset))
    if (params.mood) q.set('mood', params.mood)
    const data = await apiFetch(`/entries?${q}`)
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
  })

  server.tool('get_entry', 'Pobierz wpis po ID', {
    id: z.string().describe('UUID wpisu'),
  }, async (params) => {
    const data = await apiFetch(`/entries/${params.id}`)
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
  })

  // ── Freud ─────────────────────────────────────────────────────────────────────

  server.tool('create_conversation', 'Rozpocznij nową rozmowę z Freudem', {
    title: z.string().optional(),
    entry_id: z.string().optional(),
  }, async (params) => {
    const data = await apiFetch('/freud/conversations', { method: 'POST', body: JSON.stringify(params) })
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
  })

  server.tool('list_conversations', 'Pobierz listę rozmów z Freudem', {
    limit: z.number().optional(),
    offset: z.number().optional(),
  }, async (params) => {
    const q = new URLSearchParams()
    if (params.limit) q.set('limit', String(params.limit))
    if (params.offset) q.set('offset', String(params.offset))
    const data = await apiFetch(`/freud/conversations?${q}`)
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
  })

  server.tool('send_message', 'Wyślij wiadomość do Freuda', {
    conversation_id: z.string(),
    content: z.string(),
  }, async (params) => {
    const res = await fetch(`${BASE_URL}/api/freud/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    })
    const reader = res.body?.getReader()
    const decoder = new TextDecoder()
    let text = ''
    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
      }
    }
    return { content: [{ type: 'text', text: text || 'Brak odpowiedzi' }] }
  })

  server.tool('get_messages', 'Pobierz wiadomości z rozmowy', {
    conversation_id: z.string(),
    limit: z.number().optional(),
  }, async (params) => {
    const q = new URLSearchParams({ conversation_id: params.conversation_id })
    if (params.limit) q.set('limit', String(params.limit))
    const data = await apiFetch(`/freud/messages?${q}`)
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
  })

  return server
}

async function handleMcp(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })

  const server = createMcpServer(token)
  await server.connect(transport)

  return transport.handleRequest(req as unknown as Request)
}

export const POST = handleMcp
export const GET = handleMcp
export const DELETE = handleMcp
