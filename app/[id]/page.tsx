'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEntries } from '@/lib/entries-context'
import { moodEmoji } from '@/components/MoodSelector'
import { DeleteConfirm } from '@/components/DeleteConfirm'
import { formatDate } from '@/lib/utils'

export default function EntryDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { getEntry, deleteEntry } = useEntries()
  const [showDelete, setShowDelete] = useState(false)

  const entry = getEntry(id)

  if (!entry) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Wpis nie znaleziony</p>
      </main>
    )
  }

  function handleDelete() {
    deleteEntry(id)
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-background px-6 md:px-8 pb-10 max-w-2xl mx-auto">
      {/* Nawigacja */}
      <div className="flex items-center justify-between pt-8 mb-10">
        <button
          onClick={() => router.push('/')}
          className="text-muted hover:text-foreground transition-colors p-2 -ml-2 text-lg"
        >
          ←
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/${id}/edit`)}
            className="px-4 py-2 rounded-full border border-foreground/20 text-foreground text-sm font-medium hover:bg-foreground/5 transition-colors"
          >
            Edytuj
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
          >
            Usuń
          </button>
        </div>
      </div>

      {/* Tytuł + Mood */}
      <div className="flex items-start gap-3 mb-2">
        <h1 className="text-4xl font-black text-foreground leading-tight flex-1">
          {entry.title}
        </h1>
        {entry.mood && <span className="text-4xl mt-1 shrink-0">{moodEmoji(entry.mood)}</span>}
      </div>

      <p className="text-sm text-muted mb-8">
        {formatDate(entry.created_at)}
      </p>

      {/* Treść */}
      <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
        {entry.content || <span className="text-foreground/30 italic">Brak treści</span>}
      </p>

      {/* Tagi */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {entry.tags.map(tag => (
            <span key={tag} className="bg-foreground/10 text-foreground px-3 py-1 rounded-full text-sm font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <DeleteConfirm
        open={showDelete}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </main>
  )
}
