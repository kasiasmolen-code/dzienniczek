'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useEntries } from '@/lib/entries-context'
import { EntryForm } from '@/components/EntryForm'
import type { Mood } from '@/lib/types'

export default function EditEntry({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { getEntry, updateEntry } = useEntries()

  const entry = getEntry(id)

  if (!entry) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Wpis nie znaleziony</p>
      </main>
    )
  }

  function handleSave(data: { title: string; content: string; mood: Mood | null; tags: string[] }) {
    updateEntry(id, data)
    router.push(`/${id}`)
  }

  return (
    <main className="min-h-screen bg-background px-6 md:px-8 max-w-2xl mx-auto">
      <EntryForm
        heading="Edytuj wpis"
        initial={entry}
        onSave={handleSave}
        onCancel={() => router.back()}
      />
    </main>
  )
}
