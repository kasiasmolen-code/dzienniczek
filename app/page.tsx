'use client'

import { useRouter } from 'next/navigation'
import { useEntries } from '@/lib/entries-context'
import { EntryCard } from '@/components/EntryCard'

export default function Home() {
  const router = useRouter()
  const { entries } = useEntries()

  return (
    <main className="min-h-screen bg-background p-6 flex flex-col gap-6 max-w-sm mx-auto">
      <div className="pt-8">
        <h1 className="text-5xl font-black text-foreground leading-tight">
          Dzien<br />niczek
        </h1>
        <p className="text-muted text-sm mt-1">
          {entries.length === 0
            ? 'Brak wpisów'
            : `${entries.length} ${entries.length === 1 ? 'wpis' : entries.length < 5 ? 'wpisy' : 'wpisów'}`}
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <span className="text-5xl">📝</span>
          <p className="text-foreground font-semibold">Brak wpisów</p>
          <p className="text-muted text-sm">Kliknij + żeby dodać pierwszy wpis</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {entries.map((entry, i) => (
            <EntryCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      )}

      <div className="h-24" />

      <button
        onClick={() => router.push('/new')}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-foreground text-background rounded-full text-3xl font-light shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        +
      </button>
    </main>
  )
}
