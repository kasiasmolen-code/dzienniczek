'use client'

import { useRouter } from 'next/navigation'
import { useEntries } from '@/lib/entries-context'
import { EntryForm } from '@/components/EntryForm'
import type { Mood } from '@/lib/types'

export default function NewEntry() {
  const router = useRouter()
  const { addEntry } = useEntries()

  function handleSave(data: { title: string; content: string; mood: Mood; tags: string[] }) {
    const id = addEntry(data)
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-background px-6 md:px-8 max-w-2xl mx-auto">
      <EntryForm
        heading="Nowy wpis"
        onSave={handleSave}
        onCancel={() => router.back()}
      />
    </main>
  )
}
