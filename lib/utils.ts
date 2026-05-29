import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (min < 1) return 'Przed chwilą'
  if (min < 60) return `${min} min temu`
  if (hours < 24) return `${hours} ${hours === 1 ? 'godzinę' : 'godziny'} temu`
  if (days === 1) return 'Wczoraj'
  if (days < 7) return `${days} dni temu`
  return new Date(dateStr).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
