'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEntries } from '@/lib/entries-context'
import { moodEmoji } from '@/components/MoodSelector'
import { DeleteConfirm } from '@/components/DeleteConfirm'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

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
        <Button variant="ghost" size="default" onClick={() => router.push('/')}>
          <ChevronLeftIcon className="size-4" />
          Wstecz
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" onClick={() => router.push(`/${id}/edit`)}>
            Edytuj
          </Button>
          <Button variant="destructive" size="lg" onClick={() => setShowDelete(true)}>
            Usuń
          </Button>
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

      {/* Zdjęcie */}
      {entry.image_url && (
        <img
          src={entry.image_url}
          alt="Zdjęcie do wpisu"
          className="w-full rounded-lg mt-6 object-cover max-h-96"
        />
      )}

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
