import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { z } from 'zod'
import { NextRequest } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

function createMcpServer() {
  const server = new McpServer({
    name: 'dzienniczek',
    version: '1.0.0',
  })

  // ── Entries ──────────────────────────────────────────────────────────────────

  server.tool(
    'create_entry',
    'Utwórz nowy wpis w dzienniku użytkownika',
    {
      content: z.string().describe('Treść wpisu (wymagane, max 50 000 znaków)'),
      title: z.string().optional().describe('Tytuł wpisu'),
      mood: z.enum(['great', 'good', 'neutral', 'bad', 'terrible']).optional().describe('Nastrój'),
      tags: z.array(z.string()).optional().describe('Tagi (max 10)'),
    },
    async (params, extra) => {
      const token = (extra.authInfo as { token?: string })?.token
      const res = await fetch(`${BASE_URL}/api/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(params),
      })
      const data = await res.json()
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
    }
  )

  server.tool(
    'list_entries',
    'Pobierz listę wpisów użytkownika z opcjonalnym filtrowaniem',
    {
      limit: z.number().optional().describe('Liczba wpisów na stronie (domyślnie 20)'),
      offset: z.number().optional().describe('Przesunięcie dla paginacji'),
      mood: z.enum(['great', 'good', 'neutral', 'bad', 'terrible']).optional().describe('Filtruj po nastroju'),
      tags: z.array(z.string()).optional().describe('Filtruj po tagach'),
    },
    async (params, extra) => {
      const token = (extra.authInfo as { token?: string })?.token
      const query = new URLSearchParams()
      if (params.limit) query.set('limit', String(params.limit))
      if (params.offset) query.set('offset', String(params.offset))
      if (params.mood) query.set('mood', params.mood)
      if (params.tags) query.set('tags', params.tags.join(','))
      const res = await fetch(`${BASE_URL}/api/entries?${query}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
    }
  )

  server.tool(
    'get_entry',
    'Pobierz jeden wpis po jego ID',
    { id: z.string().describe('UUID wpisu') },
    async (params, extra) => {
      const token = (extra.authInfo as { token?: string })?.token
      const res = await fetch(`${BASE_URL}/api/entries/${params.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
    }
  )

  // ── Freud / Conversations ─────────────────────────────────────────────────────

  server.tool(
    'create_conversation',
    'Rozpocznij nową rozmowę z Freudem',
    {
      title: z.string().optional().describe('Tytuł rozmowy'),
      entry_id: z.string().optional().describe('ID wpisu powiązanego z rozmową'),
    },
    async (params, extra) => {
      const token = (extra.authInfo as { token?: string })?.token
      const res = await fetch(`${BASE_URL}/api/freud/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(params),
      })
      const data = await res.json()
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
    }
  )

  server.tool(
    'list_conversations',
    'Pobierz listę rozmów z Freudem',
    {
      limit: z.number().optional().describe('Liczba rozmów na stronie'),
      offset: z.number().optional().describe('Przesunięcie dla paginacji'),
    },
    async (params, extra) => {
      const token = (extra.authInfo as { token?: string })?.token
      const query = new URLSearchParams()
      if (params.limit) query.set('limit', String(params.limit))
      if (params.offset) query.set('offset', String(params.offset))
      const res = await fetch(`${BASE_URL}/api/freud/conversations?${query}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
    }
  )

  server.tool(
    'send_message',
    'Wyślij wiadomość do Freuda i otrzymaj odpowiedź',
    {
      conversation_id: z.string().describe('ID rozmowy'),
      content: z.string().describe('Treść wiadomości'),
    },
    async (params, extra) => {
      const token = (extra.authInfo as { token?: string })?.token
      const res = await fetch(`${BASE_URL}/api/freud/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(params),
      })
      // Collect streamed response
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
      return { content: [{ type: 'text', text: text || JSON.stringify(await res.json()) }] }
    }
  )

  server.tool(
    'get_messages',
    'Pobierz wiadomości z rozmowy z Freudem',
    {
      conversation_id: z.string().describe('ID rozmowy'),
      limit: z.number().optional().describe('Liczba wiadomości na stronie'),
    },
    async (params, extra) => {
      const token = (extra.authInfo as { token?: string })?.token
      const query = new URLSearchParams({ conversation_id: params.conversation_id })
      if (params.limit) query.set('limit', String(params.limit))
      const res = await fetch(`${BASE_URL}/api/freud/messages?${query}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
    }
  )

  return server
}

export async function POST(req: NextRequest) {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
    enableJsonResponse: true,
  })

  // Extract Bearer token from Authorization header and pass as authInfo
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined

  const server = createMcpServer()

  // Patch extra to include token for tool handlers
  const originalConnect = server.connect.bind(server)
  await originalConnect(transport)

  // Store token in transport context by overriding the request before handling
  const modifiedReq = new Request(req.url, {
    method: req.method,
    headers: req.headers,
    body: req.body,
  })

  // We pass token via a custom header that tool handlers can read from authInfo
  // The WebStandardStreamableHTTPServerTransport handles the request directly
  const response = await transport.handleRequest(modifiedReq as unknown as Request & { auth?: { token: string } })
  return response as unknown as Response
}

export async function GET(req: NextRequest) {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  const server = createMcpServer()
  await server.connect(transport)
  const response = await transport.handleRequest(req as unknown as Request)
  return response as unknown as Response
}

export async function DELETE(req: NextRequest) {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  const server = createMcpServer()
  await server.connect(transport)
  const response = await transport.handleRequest(req as unknown as Request)
  return response as unknown as Response
}
