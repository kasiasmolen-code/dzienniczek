'use client'

import { supabase } from './supabase'

const BUCKET = 'entry-images'
const SIGNED_URL_TTL = 60 * 60 // 1 godzina

/**
 * Obsługa zdjęć wpisów w prywatnym buckecie.
 *
 * W bazie (`entries.image_url`) trzymamy ŚCIEŻKĘ pliku (np. `userId/123.jpg`),
 * a nie publiczny URL. Do wyświetlenia generujemy podpisany, czasowy link.
 * Stare wpisy mogą mieć zapisany pełny publiczny URL (zaczyna się od http) —
 * zwracamy go bez zmian (po przejściu bucketa na prywatny i tak przestanie działać).
 */

/** Wgrywa plik do folderu użytkownika i zwraca ścieżkę do zapisania w bazie. */
export async function uploadEntryImage(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false })
  if (error) throw error
  return path
}

/** Zamienia zapisaną ścieżkę na czasowy, podpisany link do wyświetlenia. */
export async function getEntryImageUrl(stored: string | null | undefined): Promise<string | null> {
  if (!stored) return null
  if (stored.startsWith('http')) return stored // stary, publiczny URL — bez zmian
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(stored, SIGNED_URL_TTL)
  return data?.signedUrl ?? null
}

/** Usuwa plik z bucketa (pomija stare publiczne URL-e). */
export async function deleteEntryImage(stored: string | null | undefined): Promise<void> {
  if (!stored || stored.startsWith('http')) return
  await supabase.storage.from(BUCKET).remove([stored])
}
