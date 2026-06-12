'use client'

import type { Entry } from '@/lib/types'
import { moodEmoji } from './MoodSelector'
import { formatRelative } from '@/lib/utils'

const DAY_NAMES = ['ND', 'PN', 'WT', 'ŚR', 'CZ', 'PT', 'SO']

const CARD_STYLES = [
  { bg: 'bg-surface',      text: 'text-surface-foreground', sub: 'text-surface-foreground/60' },
  { bg: 'bg-card-orange',  text: 'text-white',               sub: 'text-white/70' },
  { bg: 'bg-card-yellow',  text: 'text-surface-foreground',  sub: 'text-surface-foreground/60' },
  { bg: 'bg-card-green',   text: 'text-white',               sub: 'text-white/70' },
  { bg: 'bg-card-blue',    text: 'text-white',               sub: 'text-white/70' },
]

interface Props {
  entries: Entry[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function EntrySidebar({ entries, selectedId, onSelect }: Props) {
  return (
    <aside className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <p className="text-muted-foreground text-sm px-4 py-6 text-center">Brak wpisów</p>
        ) : (
          <ul>
            {entries.map((entry, index) => {
              const style = CARD_STYLES[index % CARD_STYLES.length]
              return (
                <li key={entry.id} className="px-4 py-2">
                  <button
                    onClick={() => onSelect(selectedId === entry.id ? null : entry.id)}
                    className={`w-full text-left p-4 rounded-3xl transition-transform active:scale-95 hover:scale-[1.02] ${style.bg} ${
                      selectedId === entry.id ? 'ring-2 ring-white/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center justify-center rounded-2xl px-2 py-1.5 shrink-0 bg-black/10 min-w-[36px]">
                        <span className={`text-[9px] font-semibold uppercase tracking-wide ${style.sub}`}>
                          {DAY_NAMES[new Date(entry.created_at).getDay()]}
                        </span>
                        <span className={`text-base font-bold leading-tight ${style.text}`}>
                          {new Date(entry.created_at).getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <span className={`font-semibold text-sm leading-tight line-clamp-1 flex-1 ${style.text}`}>
                            {entry.title}
                          </span>
                          {entry.mood && (
                            <span className="text-base shrink-0 leading-tight">{moodEmoji(entry.mood)}</span>
                          )}
                        </div>
                        <p className={`text-xs mb-1 ${style.sub}`}>{formatRelative(entry.created_at)}</p>
                        {entry.content && (
                          <p className={`text-xs line-clamp-2 leading-relaxed ${style.text} opacity-80`}>
                            {entry.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
