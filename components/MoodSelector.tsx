'use client'

import type { Mood } from '@/lib/types'

export const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'great',   emoji: '😄', label: 'Świetnie' },
  { value: 'good',    emoji: '🙂', label: 'Dobrze' },
  { value: 'neutral', emoji: '😐', label: 'Neutralnie' },
  { value: 'bad',     emoji: '😔', label: 'Słabo' },
  { value: 'terrible',emoji: '😢', label: 'Źle' },
]

export function moodEmoji(mood: Mood): string {
  return MOODS.find(m => m.value === mood)?.emoji ?? '😐'
}

interface Props {
  value: Mood
  onChange: (mood: Mood) => void
}

export function MoodSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 justify-between">
      {MOODS.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={`flex flex-col items-center gap-1 flex-1 py-3 rounded-2xl transition-all ${
            value === m.value
              ? 'bg-foreground/10 scale-105'
              : 'opacity-40 hover:opacity-70'
          }`}
        >
          <span className="text-2xl">{m.emoji}</span>
          <span className="text-xs text-muted">{m.label}</span>
        </button>
      ))}
    </div>
  )
}
