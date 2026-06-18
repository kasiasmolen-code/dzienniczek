'use client'

import { useRouter } from 'next/navigation'
import type { Entry } from '@/lib/types'
import { moodEmoji } from './MoodSelector'
import { formatRelative } from '@/lib/utils'

const CARD_STYLES = [
  { bg: 'bg-surface',      text: 'text-surface-foreground', sub: 'text-surface-foreground/60', tag: 'bg-black/10 text-surface-foreground' },
  { bg: 'bg-card-orange',  text: 'text-primary-foreground',  sub: 'text-primary-foreground/70', tag: 'bg-primary-foreground/10 text-primary-foreground' },
  { bg: 'bg-card-yellow',  text: 'text-primary-foreground',  sub: 'text-primary-foreground/70', tag: 'bg-primary-foreground/10 text-primary-foreground' },
  { bg: 'bg-card-green',   text: 'text-primary-foreground',  sub: 'text-primary-foreground/70', tag: 'bg-primary-foreground/10 text-primary-foreground' },
  { bg: 'bg-card-blue',    text: 'text-primary-foreground',  sub: 'text-primary-foreground/70', tag: 'bg-primary-foreground/10 text-primary-foreground' },
]

interface Props {
  entry: Entry
  index: number
}

const DAY_NAMES = ['ND', 'PN', 'WT', 'ŚR', 'CZ', 'PT', 'SO']

function DateBlock({ dateStr, textClass, subClass }: { dateStr: string; textClass: string; subClass: string }) {
  const date = new Date(dateStr)
  const dayName = DAY_NAMES[date.getDay()]
  const dayNum = date.getDate()
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl px-3 py-2 shrink-0 bg-black/10 min-w-[48px]`}>
      <span className={`text-[10px] font-semibold uppercase tracking-wide ${subClass}`}>{dayName}</span>
      <span className={`text-2xl font-bold leading-tight ${textClass}`}>{dayNum}</span>
    </div>
  )
}

export function EntryCard({ entry, index }: Props) {
  const router = useRouter()
  const style = CARD_STYLES[index % CARD_STYLES.length]

  return (
    <div
      onClick={() => router.push(`/${entry.id}`)}
      className={`${style.bg} p-6 rounded-3xl cursor-pointer active:scale-95 md:hover:scale-[1.02] transition-transform`}
    >
      <div className="flex items-start gap-4">
        <DateBlock dateStr={entry.created_at} textClass={style.text} subClass={style.sub} />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-3 mb-1">
            <h2 className={`text-xl font-bold ${style.text} leading-tight`}>
              {entry.title}
            </h2>
            {entry.mood && <span className="text-2xl shrink-0">{moodEmoji(entry.mood)}</span>}
          </div>
          <p className={`text-sm mb-3 ${style.sub}`}>{formatRelative(entry.created_at)}</p>
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
      </div>
    </div>
  )
}
