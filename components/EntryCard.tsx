'use client'

import { useRouter } from 'next/navigation'
import type { Entry } from '@/lib/types'
import { moodEmoji } from './MoodSelector'
import { formatRelative } from '@/lib/utils'

const CARD_STYLES = [
  { bg: 'bg-surface',      text: 'text-surface-foreground', sub: 'text-surface-foreground/60', tag: 'bg-black/10 text-surface-foreground' },
  { bg: 'bg-card-orange',  text: 'text-white',               sub: 'text-white/70',              tag: 'bg-white/20 text-white' },
  { bg: 'bg-card-yellow',  text: 'text-surface-foreground',  sub: 'text-surface-foreground/60', tag: 'bg-black/10 text-surface-foreground' },
  { bg: 'bg-card-green',   text: 'text-white',               sub: 'text-white/70',              tag: 'bg-white/20 text-white' },
  { bg: 'bg-card-blue',    text: 'text-white',               sub: 'text-white/70',              tag: 'bg-white/20 text-white' },
]

interface Props {
  entry: Entry
  index: number
}

export function EntryCard({ entry, index }: Props) {
  const router = useRouter()
  const style = CARD_STYLES[index % CARD_STYLES.length]

  return (
    <div
      onClick={() => router.push(`/${entry.id}`)}
      className={`${style.bg} p-6 rounded-3xl cursor-pointer active:scale-95 md:hover:scale-[1.02] transition-transform`}
    >
      <div className="flex justify-between items-start mb-1 gap-3">
        <h2 className={`text-xl font-bold ${style.text} leading-tight`}>
          {entry.title}
        </h2>
        {entry.mood && <span className="text-2xl shrink-0">{moodEmoji(entry.mood)}</span>}
      </div>
      <p className={`text-sm mb-3 ${style.sub}`}>{formatRelative(entry.createdAt)}</p>
      <p className={`text-sm leading-relaxed line-clamp-2 ${style.text} opacity-90`}>
        {entry.content}
      </p>
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {entry.tags.map(tag => (
            <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${style.tag}`}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
