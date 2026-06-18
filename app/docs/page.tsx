'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Bars3Icon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { openApiSpec } from '@/lib/openapi'
import { supabase } from '@/lib/supabase'

// ─── Sidebar config ──────────────────────────────────────────────────────────

const NAV = [
  {
    label: 'API',
    items: [
      { id: 'api-getting-started', label: 'Jak zacząć' },
      { id: 'api-auth', label: 'Autoryzacja' },
      {
        id: 'api-entries', label: 'Entries', children: [
          { id: 'api-create-entry', label: 'Create Entry' },
          { id: 'api-list-entries', label: 'List Entries' },
          { id: 'api-get-entry', label: 'Get Entry' },
        ]
      },
      {
        id: 'api-freud', label: 'Freud / AI', children: [
          { id: 'api-create-conversation', label: 'Create Conversation' },
          { id: 'api-list-conversations', label: 'List Conversations' },
          { id: 'api-send-message', label: 'Send Message' },
          { id: 'api-get-messages', label: 'Get Messages' },
        ]
      },
      { id: 'api-errors', label: 'Kody błędów' },
      { id: 'api-openapi', label: 'OpenAPI Spec' },
    ]
  },
  {
    label: 'MCP',
    items: [
      { id: 'mcp-install', label: 'Instalacja' },
      { id: 'mcp-config', label: 'Konfiguracja' },
      {
        id: 'mcp-tools-entries', label: 'Tools: Entries', children: [
          { id: 'mcp-create-entry', label: 'create_entry' },
          { id: 'mcp-list-entries', label: 'list_entries' },
          { id: 'mcp-get-entry', label: 'get_entry' },
        ]
      },
      {
        id: 'mcp-tools-freud', label: 'Tools: Freud', children: [
          { id: 'mcp-create-conversation', label: 'create_conversation' },
          { id: 'mcp-list-conversations', label: 'list_conversations' },
          { id: 'mcp-send-message', label: 'send_message' },
          { id: 'mcp-get-messages', label: 'get_messages' },
        ]
      },
    ]
  },
]

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ active, onClose }: { active: string; onClose?: () => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'api-entries': true, 'api-freud': true, 'mcp-tools-entries': true, 'mcp-tools-freud': true,
  })

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onClose?.()
  }

  function toggle(id: string) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <nav className="py-6 px-4 space-y-6">
      {NAV.map(section => (
        <div key={section.label}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 px-2 mb-2">
            {section.label}
          </p>
          <ul className="space-y-0.5">
            {section.items.map(item => (
              <li key={item.id}>
                {'children' in item ? (
                  <>
                    <button
                      onClick={() => toggle(item.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors text-left ${
                        active === item.id ? 'bg-foreground/10 text-foreground' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      {item.label}
                      <ChevronRightIcon className={`w-3.5 h-3.5 transition-transform ${expanded[item.id] ? 'rotate-90' : ''}`} />
                    </button>
                    {expanded[item.id] && (
                      <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-foreground/10 pl-3">
                        {(item.children ?? []).map(child => (
                          <li key={child.id}>
                            <button
                              onClick={() => scrollTo(child.id)}
                              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors font-mono ${
                                active === child.id
                                  ? 'bg-foreground/10 text-foreground font-semibold'
                                  : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
                              }`}
                            >
                              {child.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => scrollTo(item.id)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
                      active === item.id
                        ? 'bg-foreground/10 text-foreground font-semibold'
                        : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

// ─── Auth Section ─────────────────────────────────────────────────────────────

function AuthSection() {
  const [token, setToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => { loadToken() }, [])

  async function loadToken() {
    const { data } = await supabase.auth.getSession()
    if (data.session?.access_token) {
      setToken(data.session.access_token)
      setIsLoggedIn(true)
    }
  }

  async function refreshToken() {
    setRefreshing(true)
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (!error && data.session?.access_token) setToken(data.session.access_token)
    } finally { setRefreshing(false) }
  }

  async function copyToken() {
    if (!token) return
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayToken = token ? `${token.slice(0, 24)}...${token.slice(-24)}` : 'YOUR_JWT_TOKEN'

  return (
    <div className="bg-surface/5 border border-foreground/10 rounded-3xl p-5 space-y-4">
      <p className="text-sm text-foreground/70">
        Każde żądanie wymaga tokenu JWT w nagłówku{' '}
        <code className="bg-foreground/10 px-2 py-0.5 rounded-lg text-foreground text-xs font-mono">Authorization</code>:
      </p>
      {isLoggedIn ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-success flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
              Twój token
            </span>
            <div className="flex gap-2">
              <button onClick={refreshToken} disabled={refreshing}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground/60 hover:text-foreground transition-colors disabled:opacity-40">
                <ArrowPathIcon className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                Odśwież
              </button>
              <button onClick={copyToken}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground/60 hover:text-foreground transition-colors">
                {copied ? <ClipboardDocumentCheckIcon className="w-3.5 h-3.5 text-success" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
                {copied ? 'Skopiowano!' : 'Kopiuj'}
              </button>
            </div>
          </div>
          <pre className="bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-xs text-foreground/70 font-mono overflow-x-auto select-all cursor-text">
            {`Authorization: Bearer ${displayToken}`}
          </pre>
          <p className="text-xs text-foreground/40">Zaznacz pole aby zobaczyć pełny token. Przycisk „Kopiuj" kopiuje cały token.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <pre className="bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-xs text-foreground/50 font-mono">
            {`Authorization: Bearer YOUR_JWT_TOKEN`}
          </pre>
          <p className="text-xs text-warning/80 flex items-center gap-2">
            <span>⚠️</span> Zaloguj się aby zobaczyć swój token tutaj.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Endpoint Card ────────────────────────────────────────────────────────────

const METHOD_STYLES = {
  POST: 'bg-success/15 text-success',
  GET: 'bg-info/15 text-info',
}

interface EndpointExample {
  id: string
  title: string
  method: 'GET' | 'POST'
  path: string
  description: string
  curlExample: string
  jsExample: string
  requestBody?: string
  successResponse: string
  errorResponse: string
}

function EndpointCard({ endpoint }: { endpoint: EndpointExample }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'curl' | 'js'>('curl')

  return (
    <div id={endpoint.id} className={`border border-foreground/10 rounded-3xl overflow-hidden transition-colors ${isOpen ? 'border-foreground/20' : 'hover:border-foreground/20'}`}>
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-foreground/5 transition-colors">
        <div className="flex items-center gap-3 text-left flex-1 min-w-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0 ${METHOD_STYLES[endpoint.method]}`}>
            {endpoint.method}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground">{endpoint.title}</p>
            <p className="text-xs text-foreground/40 font-mono truncate">{endpoint.path}</p>
          </div>
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-foreground/40 transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="border-t border-foreground/10 p-5 space-y-5 bg-foreground/[0.02]">
          <p className="text-sm text-foreground/70">{endpoint.description}</p>
          {endpoint.requestBody && (
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Request Body</p>
              <pre className="bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-xs text-foreground/70 font-mono overflow-x-auto">
                {endpoint.requestBody}
              </pre>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Przykład</p>
            <div className="flex gap-1 mb-3">
              {(['curl', 'js'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-mono rounded-full transition-colors ${activeTab === tab ? 'bg-foreground text-background' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/10'}`}>
                  {tab === 'js' ? 'JavaScript' : 'cURL'}
                </button>
              ))}
            </div>
            <pre className="bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-xs text-foreground/70 font-mono overflow-x-auto">
              {activeTab === 'curl' ? endpoint.curlExample : endpoint.jsExample}
            </pre>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-success/70 uppercase tracking-wider mb-2">✓ Sukces (200/201)</p>
              <pre className="bg-success/5 border border-success/20 rounded-2xl p-4 text-xs text-foreground/70 font-mono overflow-x-auto h-full">
                {endpoint.successResponse}
              </pre>
            </div>
            <div>
              <p className="text-xs font-semibold text-error/70 uppercase tracking-wider mb-2">✕ Błąd</p>
              <pre className="bg-error/5 border border-error/20 rounded-2xl p-4 text-xs text-foreground/70 font-mono overflow-x-auto h-full">
                {endpoint.errorResponse}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MCP Tool Card ────────────────────────────────────────────────────────────

interface McpTool {
  id: string
  name: string
  description: string
  params: { name: string; type: string; required: boolean; desc: string }[]
  example: string
  response: string
}

function McpToolCard({ tool }: { tool: McpTool }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div id={tool.id} className={`border border-foreground/10 rounded-3xl overflow-hidden transition-colors ${isOpen ? 'border-foreground/20' : 'hover:border-foreground/20'}`}>
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-foreground/5 transition-colors">
        <div className="flex items-center gap-3 text-left flex-1 min-w-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0 bg-tool/15 text-tool">
            tool
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground font-mono">{tool.name}</p>
            <p className="text-xs text-foreground/40 truncate">{tool.description}</p>
          </div>
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-foreground/40 transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="border-t border-foreground/10 p-5 space-y-5 bg-foreground/[0.02]">
          <p className="text-sm text-foreground/70">{tool.description}</p>

          <div>
            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">Parametry</p>
            <div className="space-y-2">
              {tool.params.map(p => (
                <div key={p.name} className="flex items-start gap-3 text-xs">
                  <code className="text-tool font-mono shrink-0">{p.name}</code>
                  <span className="text-foreground/30 shrink-0">{p.type}</span>
                  {p.required && <span className="text-error/70 shrink-0">wymagane</span>}
                  <span className="text-foreground/50">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Przykład wywołania</p>
              <pre className="bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-xs text-foreground/70 font-mono overflow-x-auto h-full">
                {tool.example}
              </pre>
            </div>
            <div>
              <p className="text-xs font-semibold text-success/70 uppercase tracking-wider mb-2">Odpowiedź</p>
              <pre className="bg-success/5 border border-success/20 rounded-2xl p-4 text-xs text-foreground/70 font-mono overflow-x-auto h-full">
                {tool.response}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const endpoints: EndpointExample[] = [
  {
    id: 'api-create-entry',
    title: 'Create Entry', method: 'POST', path: '/api/entries',
    description: 'Utwórz nowy wpis w dzienniku z opcjonalnym nastrojem i tagami',
    curlExample: `curl -X POST https://dzienniczek.app/api/entries \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"Miałem wspaniały dzień!","mood":"great","tags":["praca"]}'`,
    jsExample: `const res = await fetch('/api/entries', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: 'Miałem wspaniały dzień!', mood: 'great' }),
});
const entry = await res.json();`,
    requestBody: `{
  "content": "string (wymagane, max 50 000 znaków)",
  "title":   "string (opcjonalne)",
  "mood":    "great|good|neutral|bad|terrible (opcjonalne)",
  "tags":    ["string[]  max 10 (opcjonalne)"]
}`,
    successResponse: `{
  "data": {
    "id": "uuid",
    "title": "Świetny dzień",
    "content": "Miałem wspaniały dzień!",
    "mood": "great",
    "tags": ["praca"],
    "created_at": "2026-06-08T10:30:00Z"
  }
}`,
    errorResponse: `{
  "error": "Content is required",
  "code": "VALIDATION_ERROR"
}`,
  },
  {
    id: 'api-list-entries',
    title: 'List Entries', method: 'GET', path: '/api/entries',
    description: 'Pobierz stronicowaną listę wpisów z opcjonalnym filtrowaniem',
    curlExample: `curl "https://dzienniczek.app/api/entries?limit=10&mood=good" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    jsExample: `const res = await fetch('/api/entries?limit=10&mood=good', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' },
});
const { data, pagination } = await res.json();`,
    successResponse: `{
  "data": [{ "id": "uuid", "title": "Wpis", "mood": "good", ... }],
  "pagination": { "limit": 10, "offset": 0, "total": 42, "hasMore": true }
}`,
    errorResponse: `{
  "error": "Invalid query parameters",
  "code": "VALIDATION_ERROR"
}`,
  },
  {
    id: 'api-get-entry',
    title: 'Get Entry by ID', method: 'GET', path: '/api/entries/:id',
    description: 'Pobierz konkretny wpis po jego UUID',
    curlExample: `curl "https://dzienniczek.app/api/entries/550e8400-..." \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    jsExample: `const res = await fetch(\`/api/entries/\${id}\`, {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' },
});
const { data: entry } = await res.json();`,
    successResponse: `{
  "data": {
    "id": "550e8400-...",
    "title": "Wpis",
    "content": "Zawartość...",
    "mood": "good",
    "tags": ["tag1"],
    "created_at": "2026-06-08T10:30:00Z"
  }
}`,
    errorResponse: `{
  "error": "Entry not found",
  "code": "NOT_FOUND"
}`,
  },
  {
    id: 'api-create-conversation',
    title: 'Create Conversation', method: 'POST', path: '/api/freud/conversations',
    description: 'Rozpocznij nową rozmowę z Freudem',
    curlExample: `curl -X POST https://dzienniczek.app/api/freud/conversations \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Rozmowa o moim dniu"}'`,
    jsExample: `const res = await fetch('/api/freud/conversations', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Rozmowa o moim dniu' }),
});
const { data: conversation } = await res.json();`,
    successResponse: `{
  "data": {
    "id": "uuid",
    "title": "Rozmowa o moim dniu",
    "entry_id": null,
    "created_at": "2026-06-08T10:30:00Z"
  }
}`,
    errorResponse: `{
  "error": "Unauthorized",
  "code": "UNAUTHORIZED"
}`,
  },
  {
    id: 'api-list-conversations',
    title: 'List Conversations', method: 'GET', path: '/api/freud/conversations',
    description: 'Pobierz wszystkie rozmowy z Freudem',
    curlExample: `curl "https://dzienniczek.app/api/freud/conversations?limit=20" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    jsExample: `const res = await fetch('/api/freud/conversations?limit=20', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' },
});
const { data: conversations } = await res.json();`,
    successResponse: `{
  "data": [{ "id": "uuid", "title": "Rozmowa", "created_at": "..." }],
  "pagination": { "limit": 20, "offset": 0, "total": 5, "hasMore": false }
}`,
    errorResponse: `{
  "error": "Unauthorized",
  "code": "UNAUTHORIZED"
}`,
  },
  {
    id: 'api-send-message',
    title: 'Send Message to Freud', method: 'POST', path: '/api/freud/messages',
    description: 'Wyślij wiadomość do Freuda i odbierz strumieniowaną odpowiedź (SSE)',
    curlExample: `curl -X POST https://dzienniczek.app/api/freud/messages \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"conversation_id":"uuid","content":"Czuję się smutny..."}'`,
    jsExample: `const res = await fetch('/api/freud/messages', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ conversation_id: 'uuid', content: 'Czuję się smutny...' }),
});
const reader = res.body?.getReader();
// Odczytaj strumień SSE`,
    successResponse: `Server-Sent Events stream (text/event-stream)
Strumieniowane fragmenty odpowiedzi Freuda`,
    errorResponse: `{
  "error": "Conversation not found",
  "code": "NOT_FOUND"
}`,
  },
  {
    id: 'api-get-messages',
    title: 'Get Messages', method: 'GET', path: '/api/freud/messages',
    description: 'Pobierz wiadomości z konkretnej rozmowy',
    curlExample: `curl "https://dzienniczek.app/api/freud/messages?conversation_id=uuid&limit=50" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    jsExample: `const res = await fetch(\`/api/freud/messages?conversation_id=\${id}\`, {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' },
});
const { data: messages } = await res.json();`,
    successResponse: `{
  "data": [
    { "id": "uuid", "role": "user", "content": "Czuję się smutny...", ... },
    { "id": "uuid", "role": "assistant", "content": "Rozumiem...", ... }
  ]
}`,
    errorResponse: `{
  "error": "Conversation not found",
  "code": "NOT_FOUND"
}`,
  },
]

const mcpTools: McpTool[] = [
  {
    id: 'mcp-create-entry', name: 'create_entry',
    description: 'Utwórz nowy wpis w dzienniku użytkownika',
    params: [
      { name: 'content', type: 'string', required: true, desc: 'Treść wpisu (max 50 000 znaków)' },
      { name: 'title', type: 'string', required: false, desc: 'Tytuł wpisu' },
      { name: 'mood', type: 'enum', required: false, desc: 'great | good | neutral | bad | terrible' },
      { name: 'tags', type: 'string[]', required: false, desc: 'Tagi (max 10)' },
    ],
    example: `{
  "name": "create_entry",
  "arguments": {
    "content": "Miałem świetny dzień!",
    "mood": "great",
    "tags": ["praca", "sport"]
  }
}`,
    response: `{
  "data": {
    "id": "uuid",
    "content": "Miałem świetny dzień!",
    "mood": "great",
    "tags": ["praca", "sport"],
    "created_at": "2026-06-08T10:30:00Z"
  }
}`,
  },
  {
    id: 'mcp-list-entries', name: 'list_entries',
    description: 'Pobierz listę wpisów z opcjonalnym filtrowaniem',
    params: [
      { name: 'limit', type: 'number', required: false, desc: 'Liczba wyników (domyślnie 20)' },
      { name: 'offset', type: 'number', required: false, desc: 'Przesunięcie dla paginacji' },
      { name: 'mood', type: 'enum', required: false, desc: 'Filtruj po nastroju' },
      { name: 'tags', type: 'string[]', required: false, desc: 'Filtruj po tagach' },
    ],
    example: `{
  "name": "list_entries",
  "arguments": { "limit": 5, "mood": "great" }
}`,
    response: `{
  "data": [{ "id": "uuid", "mood": "great", ... }],
  "pagination": { "limit": 5, "total": 12, "hasMore": true }
}`,
  },
  {
    id: 'mcp-get-entry', name: 'get_entry',
    description: 'Pobierz jeden wpis po jego UUID',
    params: [
      { name: 'id', type: 'string', required: true, desc: 'UUID wpisu' },
    ],
    example: `{
  "name": "get_entry",
  "arguments": { "id": "550e8400-e29b-41d4-a716-446655440000" }
}`,
    response: `{
  "data": {
    "id": "550e8400-...",
    "title": "Wpis",
    "content": "Zawartość...",
    "mood": "good",
    "created_at": "2026-06-08T10:30:00Z"
  }
}`,
  },
  {
    id: 'mcp-create-conversation', name: 'create_conversation',
    description: 'Rozpocznij nową rozmowę z Freudem',
    params: [
      { name: 'title', type: 'string', required: false, desc: 'Tytuł rozmowy' },
      { name: 'entry_id', type: 'string', required: false, desc: 'UUID wpisu do powiązania' },
    ],
    example: `{
  "name": "create_conversation",
  "arguments": { "title": "Rozmowa o stresie" }
}`,
    response: `{
  "data": {
    "id": "uuid",
    "title": "Rozmowa o stresie",
    "entry_id": null,
    "created_at": "2026-06-08T10:30:00Z"
  }
}`,
  },
  {
    id: 'mcp-list-conversations', name: 'list_conversations',
    description: 'Pobierz listę rozmów z Freudem',
    params: [
      { name: 'limit', type: 'number', required: false, desc: 'Liczba wyników' },
      { name: 'offset', type: 'number', required: false, desc: 'Przesunięcie dla paginacji' },
    ],
    example: `{
  "name": "list_conversations",
  "arguments": { "limit": 10 }
}`,
    response: `{
  "data": [{ "id": "uuid", "title": "Rozmowa", ... }],
  "pagination": { "limit": 10, "total": 3, "hasMore": false }
}`,
  },
  {
    id: 'mcp-send-message', name: 'send_message',
    description: 'Wyślij wiadomość do Freuda i otrzymaj odpowiedź',
    params: [
      { name: 'conversation_id', type: 'string', required: true, desc: 'UUID rozmowy' },
      { name: 'content', type: 'string', required: true, desc: 'Treść wiadomości' },
    ],
    example: `{
  "name": "send_message",
  "arguments": {
    "conversation_id": "uuid",
    "content": "Czuję się przytłoczony pracą"
  }
}`,
    response: `{
  "content": [{
    "type": "text",
    "text": "Rozumiem, że praca może być przytłaczająca. Powiedz mi więcej..."
  }]
}`,
  },
  {
    id: 'mcp-get-messages', name: 'get_messages',
    description: 'Pobierz historię wiadomości z rozmowy',
    params: [
      { name: 'conversation_id', type: 'string', required: true, desc: 'UUID rozmowy' },
      { name: 'limit', type: 'number', required: false, desc: 'Liczba wiadomości' },
    ],
    example: `{
  "name": "get_messages",
  "arguments": { "conversation_id": "uuid", "limit": 50 }
}`,
    response: `{
  "data": [
    { "role": "user", "content": "Czuję się smutny...", ... },
    { "role": "assistant", "content": "Rozumiem...", ... }
  ]
}`,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('api-getting-started')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Track active section via IntersectionObserver
  useEffect(() => {
    const allIds = NAV.flatMap(s => s.items.flatMap(i => 'children' in i ? [i.id, ...(i.children ?? []).map(c => c.id)] : [i.id]))
    const observers: IntersectionObserver[] = []

    allIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveSection(id)
      }, { rootMargin: '-20% 0px -70% 0px' })
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:block w-60 shrink-0 border-r border-foreground/10 sticky top-0 h-screen overflow-y-auto">
        <div className="px-4 pt-6 pb-2">
          <Button variant="ghost" size="default" onClick={() => router.push('/')}>
            <ChevronLeftIcon className="size-4" />
            Wstecz
          </Button>
          <h1 className="text-base font-black text-foreground mt-3 leading-tight">Dokumentacja</h1>
          <p className="text-xs text-foreground/40 mt-0.5">Dzienniczek API & MCP</p>
        </div>
        <Sidebar active={activeSection} />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-background border-r border-foreground/10 overflow-y-auto">
            <div className="px-4 pt-6 pb-2 flex items-center justify-between">
              <h1 className="text-base font-black text-foreground">Dokumentacja</h1>
              <button onClick={() => setMobileOpen(false)} className="text-foreground/40 hover:text-foreground">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <Sidebar active={activeSection} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 pb-28 lg:pb-16">

        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-foreground/10 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-foreground/60 hover:text-foreground">
            <Bars3Icon className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-foreground">Dokumentacja</span>
        </div>

        <div className="max-w-3xl mx-auto px-6 lg:px-10 space-y-16 pt-10">

          {/* ════════ API ════════ */}

          <section id="api-getting-started" className="scroll-mt-6">
            <h2 className="text-2xl font-black text-foreground mb-4">Jak zacząć</h2>
            <div className="bg-surface/5 border border-foreground/10 rounded-3xl p-5 space-y-3 text-sm text-foreground/70">
              <p>Dzienniczek REST API umożliwia tworzenie wpisów, zarządzanie rozmowami z Freudem i pobieranie danych programistycznie.</p>
              <p>Wszystkie endpointy wymagają autentykacji JWT Supabase w nagłówku <code className="bg-foreground/10 px-2 py-0.5 rounded-lg text-foreground text-xs font-mono">Authorization</code>.</p>
              <div className="pt-1">
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Base URL</p>
                <pre className="bg-foreground/5 border border-foreground/10 rounded-2xl p-3 text-xs font-mono text-foreground/60">{`https://dzienniczek.app/api\nhttp://localhost:3000/api  (dev)`}</pre>
              </div>
            </div>
          </section>

          <section id="api-auth" className="scroll-mt-6">
            <h2 className="text-2xl font-black text-foreground mb-4">Autoryzacja</h2>
            <AuthSection />
          </section>

          <section id="api-entries" className="scroll-mt-6">
            <h2 className="text-2xl font-black text-foreground mb-1">Entries</h2>
            <p className="text-sm text-foreground/50 mb-4">Endpointy do zarządzania wpisami dziennika</p>
            <div className="space-y-2">
              {endpoints.slice(0, 3).map(ep => <EndpointCard key={ep.id} endpoint={ep} />)}
            </div>
          </section>

          <section id="api-freud" className="scroll-mt-6">
            <h2 className="text-2xl font-black text-foreground mb-1">Freud / AI</h2>
            <p className="text-sm text-foreground/50 mb-4">Endpointy do komunikacji z Freudem (asystentem AI)</p>
            <div className="space-y-2">
              {endpoints.slice(3).map(ep => <EndpointCard key={ep.id} endpoint={ep} />)}
            </div>
          </section>

          <section id="api-errors" className="scroll-mt-6">
            <h2 className="text-2xl font-black text-foreground mb-4">Kody błędów</h2>
            <div className="bg-surface/5 border border-foreground/10 rounded-3xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-foreground/10">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-foreground/50 uppercase tracking-wider">Kod</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-foreground/50 uppercase tracking-wider">HTTP</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-foreground/50 uppercase tracking-wider">Opis</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { code: 'UNAUTHORIZED', http: '401', desc: 'Brak lub nieprawidłowy token autoryzacji' },
                    { code: 'VALIDATION_ERROR', http: '400', desc: 'Nieprawidłowe parametry lub treść żądania' },
                    { code: 'NOT_FOUND', http: '404', desc: 'Zasób nie został znaleziony' },
                    { code: 'INTERNAL_ERROR', http: '500', desc: 'Błąd serwera' },
                  ].map((row, i, arr) => (
                    <tr key={row.code} className={i < arr.length - 1 ? 'border-b border-foreground/10' : ''}>
                      <td className="px-5 py-3 font-mono text-xs text-foreground/70">{row.code}</td>
                      <td className="px-5 py-3 text-foreground/50">{row.http}</td>
                      <td className="px-5 py-3 text-foreground/70 text-xs">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="api-openapi" className="scroll-mt-6">
            <h2 className="text-2xl font-black text-foreground mb-4">OpenAPI Spec</h2>
            <div className="bg-surface/5 border border-foreground/10 rounded-3xl p-5 space-y-4">
              <p className="text-sm text-foreground/70">Pełna specyfikacja OpenAPI 3.0 dostępna jako JSON:</p>
              <a href="/api/openapi.json" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors">
                Pobierz openapi.json ↗
              </a>
              <details className="mt-2">
                <summary className="text-xs text-foreground/40 cursor-pointer hover:text-foreground/60 transition-colors select-none">Pokaż spec inline</summary>
                <pre className="mt-3 bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-xs text-foreground/50 font-mono overflow-auto max-h-80">
                  {JSON.stringify(openApiSpec, null, 2)}
                </pre>
              </details>
            </div>
          </section>

          {/* ════════ MCP ════════ */}

          <div className="border-t border-foreground/10 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Model Context Protocol</p>
          </div>

          <section id="mcp-install" className="scroll-mt-6">
            <h2 className="text-2xl font-black text-foreground mb-4">Instalacja MCP</h2>
            <div className="bg-surface/5 border border-foreground/10 rounded-3xl p-5 space-y-4 text-sm text-foreground/70">
              <p>
                Dzienniczek udostępnia serwer MCP przez HTTP. Agenci AI (np. Claude Desktop, Cursor, Cline)
                mogą łączyć się bezpośrednio z endpointem bez instalowania czegokolwiek lokalnie.
              </p>
              <div>
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Endpoint MCP</p>
                <pre className="bg-foreground/5 border border-foreground/10 rounded-2xl p-3 text-xs font-mono text-foreground/60">{`https://dzienniczek.app/api/mcp\nhttp://localhost:3000/api/mcp  (dev)`}</pre>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Transport</p>
                <p className="text-xs">Streamable HTTP (MCP spec 2025-03-26) — obsługuje POST, GET i DELETE.</p>
              </div>
            </div>
          </section>

          <section id="mcp-config" className="scroll-mt-6">
            <h2 className="text-2xl font-black text-foreground mb-4">Konfiguracja</h2>
            <div className="space-y-4">
              <div className="bg-surface/5 border border-foreground/10 rounded-3xl p-5 space-y-3 text-sm text-foreground/70">
                <p>
                  MCP server wymaga tokenu JWT (tego samego co API) przekazanego w nagłówku{' '}
                  <code className="bg-foreground/10 px-2 py-0.5 rounded-lg text-foreground text-xs font-mono">Authorization</code>.
                  Skopiuj swój token z sekcji <button onClick={() => document.getElementById('api-auth')?.scrollIntoView({ behavior: 'smooth' })} className="text-foreground underline underline-offset-2">Autoryzacja</button> powyżej.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2 px-1">Claude Desktop — claude_desktop_config.json</p>
                <pre className="bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-xs text-foreground/70 font-mono overflow-x-auto">{`{
  "mcpServers": {
    "dzienniczek": {
      "url": "https://dzienniczek.app/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_JWT_TOKEN"
      }
    }
  }
}`}</pre>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2 px-1">Cursor / Cline — mcp_settings.json</p>
                <pre className="bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-xs text-foreground/70 font-mono overflow-x-auto">{`{
  "mcpServers": {
    "dzienniczek": {
      "command": "npx",
      "args": ["-y", "mcp-client-http", "https://dzienniczek.app/api/mcp"],
      "env": {
        "MCP_AUTH_HEADER": "Authorization: Bearer YOUR_JWT_TOKEN"
      }
    }
  }
}`}</pre>
              </div>
            </div>
          </section>

          <section id="mcp-tools-entries" className="scroll-mt-6">
            <h2 className="text-2xl font-black text-foreground mb-1">Tools: Entries</h2>
            <p className="text-sm text-foreground/50 mb-4">Narzędzia do zarządzania wpisami dziennika</p>
            <div className="space-y-2">
              {mcpTools.slice(0, 3).map(t => <McpToolCard key={t.id} tool={t} />)}
            </div>
          </section>

          <section id="mcp-tools-freud" className="scroll-mt-6">
            <h2 className="text-2xl font-black text-foreground mb-1">Tools: Freud</h2>
            <p className="text-sm text-foreground/50 mb-4">Narzędzia do komunikacji z asystentem Freud</p>
            <div className="space-y-2">
              {mcpTools.slice(3).map(t => <McpToolCard key={t.id} tool={t} />)}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
