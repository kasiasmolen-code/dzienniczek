'use client'

import { useState, type FormEvent } from 'react'
import type { Mood, Entry } from '@/lib/types'
import { MoodSelector } from './MoodSelector'
import { TagInput } from './TagInput'

interface FormData {
  title: string
  content: string
  mood: Mood
  tags: string[]
}

interface Props {
  heading: string
  initial?: Partial<Entry>
  onSave: (data: FormData) => void
  onCancel: () => void
}

export function EntryForm({ heading, initial, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [mood, setMood] = useState<Mood>(initial?.mood ?? 'neutral')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title, content, mood, tags })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-8 pb-10">
      {/* Nawigacja */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="text-muted hover:text-foreground transition-colors text-sm px-2 py-1 -ml-2"
        >
          ← Wróć
        </button>
        <h1 className="text-base font-bold text-foreground">{heading}</h1>
        <button
          type="submit"
          className="bg-foreground text-background px-5 py-2 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          Zapisz
        </button>
      </div>

      {/* Tytuł */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Tytuł wpisu..."
        required
        className="text-2xl font-bold bg-transparent text-foreground placeholder:text-muted outline-none border-b border-foreground/10 pb-3"
      />

      {/* Nastrój */}
      <div>
        <p className="text-sm text-muted mb-3">Jak się czujesz?</p>
        <MoodSelector value={mood} onChange={setMood} />
      </div>

      {/* Treść */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Co chcesz zapisać dzisiaj..."
        rows={8}
        className="bg-foreground/5 rounded-2xl p-4 text-foreground placeholder:text-muted outline-none resize-none text-base leading-relaxed"
      />

      {/* Tagi */}
      <div>
        <p className="text-sm text-muted mb-2">Tagi</p>
        <TagInput value={tags} onChange={setTags} />
      </div>
    </form>
  )
}
