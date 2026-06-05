'use client'

import { useRouter } from 'next/navigation'
import { Brain } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useEntries } from '@/lib/entries-context'
import { EntryCard } from '@/components/EntryCard'
import { EntrySidebar } from '@/components/EntrySidebar'
import { EntryForm } from '@/components/EntryForm'
import type { Mood } from '@/lib/types'

export default function Home() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const { entries, loading, addEntry, updateEntry } = useEntries()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  // Auto-select most recent entry on load
  useEffect(() => {
    if (!loading && entries.length > 0 && selectedId === null) {
      setSelectedId(entries[0].id)
    }
  }, [loading, entries, selectedId])

  if (authLoading || !user) return null

  const selectedEntry = selectedId ? entries.find(e => e.id === selectedId) : null

  async function handleNewEntry() {
    const id = await addEntry({ title: 'Nowa notatka', content: '', mood: null, tags: [] })
    setSelectedId(id)
    setIsNew(true)
  }

  async function handleSaveEdit(data: { title: string; content: string; mood: Mood | null; tags: string[] }) {
    if (!selectedId) return
    await updateEntry(selectedId, { ...data, title: data.title || 'Nowa notatka' })
    if (data.title) setIsNew(false)
  }

  const entryCount = entries.length
  const countLabel = loading
    ? 'Ładowanie…'
    : entryCount === 0
    ? 'Brak wpisów'
    : `${entryCount} ${entryCount === 1 ? 'wpis' : entryCount < 5 ? 'wpisy' : 'wpisów'}`

  return (
    <>
      {/* ── MOBILE layout (< lg) ── */}
      <main className="lg:hidden min-h-screen bg-background p-6 md:p-8 flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="pt-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight whitespace-nowrap">
              Dzienniczek
            </h1>
            <p className="text-muted text-sm mt-1">{countLabel}</p>
          </div>
          <button
            onClick={signOut}
            className="mt-2 text-xs text-muted hover:text-foreground transition-colors"
          >
            Wyloguj
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <span className="text-5xl">📝</span>
            <p className="text-foreground font-semibold">Brak wpisów</p>
            <p className="text-muted text-sm">Kliknij + żeby dodać pierwszy wpis</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry, i) => (
              <EntryCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        )}

        <div className="h-28" />
      </main>

      {/* ── DESKTOP layout (≥ lg) ── */}
      <div className="hidden lg:flex h-screen bg-background overflow-hidden">
        {/* Left panel — entry list */}
        <div className="w-[22%] min-w-[220px] max-w-[320px] flex flex-col border-r border-foreground/10 h-full">
          {/* Header */}
          <div className="px-4 pt-6 pb-4 border-b border-foreground/10 flex items-start justify-between shrink-0">
            <div>
              <h1 className="text-xl font-black text-foreground leading-tight">Dzienniczek</h1>
              <p className="text-muted text-xs mt-0.5">{countLabel}</p>
            </div>
            <button
              onClick={signOut}
              className="text-xs text-muted hover:text-foreground transition-colors mt-1"
            >
              Wyloguj
            </button>
          </div>

          {/* New entry button */}
          <button
            onClick={handleNewEntry}
            className="mx-3 mt-3 mb-1 py-2 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-80 transition-opacity shrink-0"
          >
            + Nowy wpis
          </button>

          {/* Freud button */}
          <button
            onClick={() => router.push('/freud')}
            className="mx-3 mb-3 py-2 border border-foreground/20 text-foreground rounded-full text-sm font-semibold hover:bg-foreground/5 transition-colors shrink-0 flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4" /> Freud
          </button>

          {/* Entries list */}
          <div className="flex-1 overflow-hidden">
            <EntrySidebar
              entries={entries}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>

        {/* Right panel — editor */}
        <div className="flex-1 overflow-y-auto px-10 max-w-3xl">
          {selectedEntry ? (
            <EntryForm
              key={selectedEntry.id}
              heading={selectedEntry.title}
              initial={isNew ? { ...selectedEntry, title: '' } : selectedEntry}
              onSave={handleSaveEdit}
              onCancel={() => { setSelectedId(null); setIsNew(false) }}
              autoSave
              focusTitle={isNew}
            />
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted text-sm">
              Kliknij „+ Nowy wpis" żeby zacząć
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
