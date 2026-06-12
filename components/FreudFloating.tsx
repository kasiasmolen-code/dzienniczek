'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Brain } from 'lucide-react'
import { XMarkIcon, ClockIcon, ChevronLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useConversations } from '@/lib/conversations-context'
import { useEntries } from '@/lib/entries-context'
import { FreudChat } from '@/components/FreudChat'
import { Button } from '@/components/ui/button'
import type { Conversation } from '@/lib/conversations-context'

const EXCLUDED = ['/login', '/freud', '/docs']

function getEntryIdFromPath(pathname: string): string | null {
  if (pathname === '/') return null
  if (EXCLUDED.some(p => pathname === p || pathname.startsWith(p + '/'))) return null
  // Match /{uuid} or /{uuid}/edit
  const match = pathname.match(/^\/([^/]+)/)
  return match ? match[1] : null
}

export function FreudFloating() {
  const pathname = usePathname()
  const { conversations, loading, createConversation, deleteConversation, updateConversationTitle } = useConversations()
  const { getEntry } = useEntries()
  const [open, setOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [activeConvId, setActiveConvId] = useState<string | null>(null)

  const entryId = getEntryIdFromPath(pathname)

  // Hide on excluded pages
  if (EXCLUDED.some(p => pathname === p || pathname.startsWith(p + '/'))) return null

  const activeConversation = conversations.find(c => c.id === activeConvId) ?? null
  const activeEntry = activeConversation?.entry_id ? getEntry(activeConversation.entry_id) : null

  async function handleOpen() {
    if (!open) {
      // Auto-create conversation for entry context, or pick most recent
      if (entryId && !activeConvId) {
        const id = await createConversation(entryId)
        setActiveConvId(id)
      } else if (!activeConvId && conversations.length > 0) {
        setActiveConvId(conversations[0].id)
      }
    }
    setOpen(o => !o)
    setShowHistory(false)
  }

  async function handleNew() {
    const id = await createConversation(entryId ?? undefined)
    setActiveConvId(id)
    setShowHistory(false)
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    await deleteConversation(id)
    if (activeConvId === id) setActiveConvId(null)
  }

  function handleTitleGenerated(id: string, title: string) {
    updateConversationTitle(id, title)
  }

  return (
    <>
      {/* Floating button — desktop only */}
      <button
        onClick={handleOpen}
        className={`hidden lg:flex fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl items-center justify-center transition-all hover:scale-105 active:scale-95 ${
          open ? 'bg-foreground text-background ring-2 ring-foreground/30' : 'bg-foreground/90 backdrop-blur-sm text-background'
        }`}
        aria-label="Freud"
      >
        <Brain className="w-6 h-6" />
      </button>

      {/* Slide-in panel — desktop only */}
      {open && (
        <div className="hidden lg:flex fixed inset-y-0 right-0 z-40 w-[420px] flex-col bg-background border-l border-foreground/10 shadow-2xl">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 shrink-0">
            {showHistory ? (
              <Button variant="ghost" size="default" onClick={() => setShowHistory(false)}>
                <ChevronLeftIcon className="size-4" />
                Wstecz
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-foreground" />
                <span className="font-bold text-sm text-foreground">Freud</span>
                {activeConversation?.title && (
                  <span className="text-xs text-muted-foreground truncate max-w-[140px]">{activeConversation.title}</span>
                )}
              </div>
            )}
            <div className="flex items-center gap-1">
              {!showHistory && (
                <>
                  <button
                    onClick={handleNew}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/8 transition-colors"
                    title="Nowa rozmowa"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowHistory(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-foreground/8 transition-colors"
                  >
                    <ClockIcon className="w-3.5 h-3.5" /> Historia
                  </button>
                </>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/8 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panel body */}
          <div className="flex-1 overflow-hidden">
            {showHistory ? (
              <ConversationList
                conversations={conversations}
                loading={loading}
                activeId={activeConvId}
                onSelect={(id) => { setActiveConvId(id); setShowHistory(false) }}
                onDelete={handleDelete}
                onNew={handleNew}
              />
            ) : activeConvId ? (
              <FreudChat
                conversationId={activeConvId}
                activeEntry={activeEntry}
                onTitleGenerated={(title) => handleTitleGenerated(activeConvId, title)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                <span className="text-5xl">🧠</span>
                <p className="text-muted-foreground text-sm">Kliknij + żeby rozpocząć rozmowę</p>
                <Button variant="default" size="default" onClick={handleNew}>
                  Nowa rozmowa
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
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
  if (loading) return <p className="text-muted-foreground text-sm px-4 py-6 text-center">Ładowanie…</p>
  if (conversations.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-muted-foreground text-sm mb-3">Brak rozmów</p>
        <Button variant="secondary" size="lg" onClick={onNew}>
          Rozpocznij pierwszą rozmowę
        </Button>
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
              <p className="text-sm font-medium text-foreground truncate">{c.title ?? 'Nowa rozmowa'}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(c.created_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <button
              onClick={(e) => onDelete(c.id, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 shrink-0"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
