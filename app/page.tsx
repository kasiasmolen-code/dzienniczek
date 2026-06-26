'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useEntries } from '@/lib/entries-context'
import { EntryCard } from '@/components/EntryCard'
import { DesktopSidebar } from '@/components/DesktopSidebar'

export default function HomePage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const { entries, loading } = useEntries()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  if (authLoading || !user) return null

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
            <p className="text-muted-foreground text-sm mt-1">{countLabel}</p>
          </div>
          <button
            onClick={signOut}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Wyloguj
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <span className="text-5xl">📝</span>
            <p className="text-foreground font-semibold">Brak wpisów</p>
            <p className="text-muted-foreground text-sm">Kliknij + żeby dodać pierwszy wpis</p>
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

        {/* ── Left sidebar ── */}
        <DesktopSidebar subtitle={countLabel} />

        {/* ── Main content — entry cards grid ── */}
        <main className="flex-1 overflow-y-auto p-8">
          {loading ? null : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <span className="text-5xl">📝</span>
              <p className="text-foreground font-semibold">Brak wpisów</p>
              <p className="text-muted-foreground text-sm">Kliknij „Nowy wpis" żeby zacząć</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 max-w-5xl">
              {entries.map((entry, i) => (
                <EntryCard key={entry.id} entry={entry} index={i} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
