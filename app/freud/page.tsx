'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useConversations } from '@/lib/conversations-context'
import { useEntries } from '@/lib/entries-context'
import { supabase } from '@/lib/supabase'
import { FreudChat } from '@/components/FreudChat'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import type { Conversation } from '@/lib/conversations-context'
import type { Therapist } from '@/lib/types'

const THERAPIST_EMOJI: Record<string, string> = {
  freud: '🧠',
  'terapeuta-1': '🌿',
  psycholozka: '💛',
}

export default function FreudPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { conversations, loading, createConversation, deleteConversation, updateConversationTitle } = useConversations()
  const { getEntry } = useEntries()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [therapist, setTherapist] = useState<Therapist | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  // Handle ?conv= and ?therapist= from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const convId = params.get('conv')
    if (convId) setActiveId(convId)

    const therapistSlug = params.get('therapist')
    if (therapistSlug) {
      supabase
        .from('therapists')
        .select('*')
        .eq('slug', therapistSlug)
        .single()
        .then(({ data }) => { if (data) setTherapist(data as Therapist) })
    }
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
          <Button variant="ghost" size="default" onClick={() => router.push('/therapists')}>
            <ChevronLeftIcon className="size-4" />
            Wstecz
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-black text-foreground">{THERAPIST_EMOJI[therapist?.slug ?? 'freud']} {therapist?.name ?? 'Freud'}</h1>
            {activeConversation?.title && (
              <p className="text-xs text-muted-foreground truncate">{activeConversation.title}</p>
            )}
          </div>
          <Button variant="outline" size="default" onClick={() => setShowSidebar(true)}>
            Historia
          </Button>
          <button
            onClick={handleNew}
            className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-hidden">
          {activeId ? (
            <FreudChat
              conversationId={activeId}
              activeEntry={activeEntry}
              onTitleGenerated={(title) => handleTitleGenerated(activeId, title)}
              therapistSystemPrompt={therapist?.system_prompt}
              therapistName={therapist?.name ?? 'Freud'}
              therapistEmoji={THERAPIST_EMOJI[therapist?.slug ?? 'freud'] ?? '🧠'}
            />
          ) : (
            <EmptyState onNew={handleNew} therapistName={therapist?.name ?? 'Freud'} therapistEmoji={THERAPIST_EMOJI[therapist?.slug ?? 'freud'] ?? '🧠'} />
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
              <Button variant="ghost" size="default" onClick={() => router.push('/therapists')} className="mb-2">
                <ChevronLeftIcon className="size-4" />
                Wstecz
              </Button>
              <h1 className="text-xl font-black text-foreground">{THERAPIST_EMOJI[therapist?.slug ?? 'freud']} {therapist?.name ?? 'Freud'}</h1>
            </div>
            <button
              onClick={handleNew}
              className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              title="Nowa rozmowa"
            >
              <PlusIcon className="w-4 h-4" />
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
              therapistSystemPrompt={therapist?.system_prompt}
              therapistName={therapist?.name ?? 'Freud'}
              therapistEmoji={THERAPIST_EMOJI[therapist?.slug ?? 'freud'] ?? '🧠'}
            />
          ) : (
            <EmptyState onNew={handleNew} therapistName={therapist?.name ?? 'Freud'} therapistEmoji={THERAPIST_EMOJI[therapist?.slug ?? 'freud'] ?? '🧠'} />
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
              <p className="text-sm font-medium text-foreground truncate">
                {c.title ?? 'Nowa rozmowa'}
              </p>
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

function EmptyState({ onNew, therapistName = 'Freud', therapistEmoji = '🧠' }: { onNew: () => void; therapistName?: string; therapistEmoji?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-8">
      <span className="text-6xl">{therapistEmoji}</span>
      <div>
        <h2 className="text-xl font-black text-foreground mb-2">Cześć, jestem {therapistName}</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          Twój asystent terapeutyczny. Analizuję Twoje wpisy i pomagam zrozumieć emocje oraz wzorce nastroju.
        </p>
      </div>
      <Button variant="default" size="default" onClick={onNew}>
        Rozpocznij rozmowę
      </Button>
    </div>
  )
}
