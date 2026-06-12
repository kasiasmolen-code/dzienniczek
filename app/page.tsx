'use client'

import { useRouter } from 'next/navigation'
import { HomeIcon, BookOpenIcon, ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useEntries } from '@/lib/entries-context'
import { EntryCard } from '@/components/EntryCard'

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
        <aside className="w-60 shrink-0 flex flex-col border-r border-foreground/10 h-full px-4 py-6">
          {/* App name */}
          <div className="mb-6 px-1">
            <h1 className="text-lg font-black text-foreground leading-tight">Dzienniczek</h1>
            <p className="text-muted-foreground text-xs mt-0.5">{countLabel}</p>
          </div>

          {/* New entry — big bar */}
          <button
            onClick={() => router.push('/new')}
            className="flex items-center justify-center gap-2 w-full py-3 mb-6 bg-foreground text-background rounded-lg text-sm font-semibold hover:opacity-85 transition-opacity"
          >
            <PlusIcon className="w-4 h-4" />
            Nowy wpis
          </button>

          {/* Nav links */}
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground bg-foreground/8 hover:bg-foreground/10 transition-colors text-left"
            >
              <HomeIcon className="w-4 h-4 shrink-0" />
              Home
            </button>
          </nav>

          {/* Bottom section */}
          <div className="mt-auto flex flex-col gap-1">
            <button
              onClick={() => router.push('/docs')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/60 hover:bg-foreground/8 hover:text-foreground transition-colors text-left"
            >
              <BookOpenIcon className="w-4 h-4 shrink-0" />
              API Docs
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/60 hover:bg-foreground/8 hover:text-foreground transition-colors text-left"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
              Wyloguj
            </button>
          </div>
        </aside>

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
