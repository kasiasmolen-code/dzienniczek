'use client'

import type { Mood } from '@/lib/types'

export const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'terrible',emoji: '😢', label: 'Źle' },
  { value: 'bad',     emoji: '😔', label: 'Słabo' },
  { value: 'neutral', emoji: '😐', label: 'Neutralnie' },
  { value: 'good',    emoji: '🙂', label: 'Dobrze' },
  { value: 'great',   emoji: '😄', label: 'Świetnie' },
]

export function moodEmoji(mood: Mood | null): string {
  if (!mood) return ''
  return MOODS.find(m => m.value === mood)?.emoji ?? ''
}

interface Props {
  value: Mood | null
  onChange: (mood: Mood | null) => void
}

export function MoodSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 justify-between">
      {MOODS.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(value === m.value ? null : m.value)}
          className={`flex flex-col items-center gap-1 flex-1 py-3 rounded-2xl transition-all ${
            value === m.value
              ? 'bg-foreground/10 scale-105 opacity-100'
              : 'opacity-40 hover:opacity-70'
          }`}
        >
          <span className="text-2xl">{m.emoji}</span>
          <span className="text-xs text-muted-foreground">{m.label}</span>
        </button>
      ))}
    </div>
  )
}
