'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useConversations } from '@/lib/conversations-context'
import { useEntries } from '@/lib/entries-context'
import { FreudChat } from '@/components/FreudChat'
import { Trash2, Plus, ChevronLeft } from 'lucide-react'
import type { Conversation } from '@/lib/conversations-context'

export default function FreudPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { conversations, loading, createConversation, deleteConversation, updateConversationTitle } = useConversations()
  const { getEntry } = useEntries()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  // Handle ?conv= from entry page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const convId = params.get('conv')
    if (convId) setActiveId(convId)
  }, [])

  if (authLoading || !user) return null

  async function handleNew() {
    const id = await createConversation()
    setActiveId(id)
    setShowSidebar(false)
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    await deleteConversation(id)
    if (activeId === id) setActiveId(null)
  }

  function handleTitleGenerated(id: string, title: string) {
    updateConversationTitle(id, title)
  }

  const activeConversation = conversations.find(c => c.id === activeId)
  const activeEntry = activeConversation?.entry_id ? getEntry(activeConversation.entry_id) : null

  return (
    <>
      {/* ── MOBILE (< lg) ── */}
      <div className="lg:hidden flex flex-col h-screen bg-background">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-4 border-b border-foreground/10 shrink-0">
          <button onClick={() => router.push('/')} className="text-muted hover:text-foreground transition-colors p-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-black text-foreground">Freud</h1>
            {activeConversation?.title && (
              <p className="text-xs text-muted truncate">{activeConversation.title}</p>
            )}
          </div>
          <button
            onClick={() => setShowSidebar(true)}
            className="text-xs text-muted hover:text-foreground border border-foreground/20 rounded-full px-3 py-1"
          >
            Historia
          </button>
          <button
            onClick={handleNew}
            className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-hidden">
          {activeId ? (
            <FreudChat
              conversationId={activeId}
              activeEntry={activeEntry}
              onTitleGenerated={(title) => handleTitleGenerated(activeId, title)}
            />
          ) : (
            <EmptyState onNew={handleNew} />
          )}
        </div>

        {/* Mobile history drawer */}
        {showSidebar && (
          <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setShowSidebar(false)}>
            <div
              className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <ConversationList
                conversations={conversations}
                loading={loading}
                activeId={activeId}
                onSelect={(id) => { setActiveId(id); setShowSidebar(false) }}
                onDelete={handleDelete}
                onNew={handleNew}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP (≥ lg) ── */}
      <div className="hidden lg:flex h-screen bg-background overflow-hidden">
        {/* Left sidebar */}
        <div className="w-[22%] min-w-[220px] max-w-[320px] flex flex-col border-r border-foreground/10 h-full">
          <div className="px-4 pt-6 pb-4 border-b border-foreground/10 flex items-center justify-between shrink-0">
            <div>
              <button onClick={() => router.push('/')} className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-2">
                <ChevronLeft className="w-4 h-4" /> Wstecz
              </button>
              <h1 className="text-xl font-black text-foreground">🧠 Freud</h1>
            </div>
            <button
              onClick={handleNew}
              className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              title="Nowa rozmowa"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={conversations}
              loading={loading}
              activeId={activeId}
              onSelect={setActiveId}
              onDelete={handleDelete}
              onNew={handleNew}
            />
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeId ? (
            <FreudChat
              conversationId={activeId}
              activeEntry={activeEntry}
              onTitleGenerated={(title) => handleTitleGenerated(activeId, title)}
            />
          ) : (
            <EmptyState onNew={handleNew} />
          )}
        </div>
      </div>
    </>
  )
}

function ConversationList({
  conversations,
  loading,
  activeId,
  onSelect,
  onDelete,
  onNew,
}: {
  conversations: Conversation[]
  loading: boolean
  activeId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string, e: React.MouseEvent) => void
  onNew: () => void
}) {
  if (loading) return <p className="text-muted text-sm px-4 py-6 text-center">Ładowanie…</p>
  if (conversations.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-muted text-sm mb-3">Brak rozmów</p>
        <button onClick={onNew} className="text-xs text-foreground border border-foreground/20 rounded-full px-4 py-2 hover:bg-foreground/5 transition-colors">
          Rozpocznij pierwszą rozmowę
        </button>
      </div>
    )
  }
  return (
    <ul className="py-2">
      {conversations.map(c => (
        <li key={c.id} className="px-3 py-1">
          <div
            onClick={() => onSelect(c.id)}
            className={`w-full text-left px-3 py-2.5 rounded-2xl transition-colors flex items-center justify-between gap-2 group cursor-pointer ${
              activeId === c.id ? 'bg-foreground/10' : 'hover:bg-foreground/5'
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {c.title ?? 'Nowa rozmowa'}
              </p>
              <p className="text-xs text-muted">
                {new Date(c.created_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <button
              onClick={(e) => onDelete(c.id, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-red-400 p-1 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-8">
      <span className="text-6xl">🧠</span>
      <div>
        <h2 className="text-xl font-black text-foreground mb-2">Cześć, jestem Freud</h2>
        <p className="text-muted text-sm max-w-sm">
          Twój asystent terapeutyczny. Analizuję Twoje wpisy i pomagam zrozumieć emocje oraz wzorce nastroju.
        </p>
      </div>
      <button
        onClick={onNew}
        className="bg-foreground text-background px-6 py-3 rounded-full font-semibold text-sm hover:opacity-80 transition-opacity"
      >
        Rozpocznij rozmowę
      </button>
    </div>
  )
}
