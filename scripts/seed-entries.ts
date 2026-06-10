/**
 * Seed script: generates 100 historical diary entries + embeddings
 *
 * Usage:
 *   npx tsx scripts/seed-entries.ts
 *
 * Required in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 *   OPENAI_API_KEY
 *   SEED_USER_ID   (UUID from Supabase Dashboard → Authentication → Users)
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// Parse .env.local manually (no dotenv dependency needed)
function loadEnv() {
  const envFile = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envFile)) return
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}
loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!
const OPENAI_KEY = process.env.OPENAI_API_KEY!
const USER_ID = process.env.SEED_USER_ID!

const missing = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'SEED_USER_ID']
  .filter(k => !process.env[k])
if (missing.length) {
  console.error('Brakujące zmienne env:', missing.join(', '))
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible'

interface SeedEntry {
  title: string
  content: string
  mood: Mood
  tags: string[]
  created_at: string
}

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`)
  const data = await res.json() as { content: { type: string; text: string }[] }
  return data.content[0]?.text ?? ''
}

async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text.slice(0, 8000) }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`)
  const data = await res.json() as { data: { embedding: number[] }[] }
  return data.data[0].embedding
}

async function generateBatch(idx: number, total: number, daysAgoStart: number, daysAgoEnd: number): Promise<SeedEntry[]> {
  const today = new Date()
  const start = new Date(today); start.setDate(today.getDate() - daysAgoStart)
  const end = new Date(today); end.setDate(today.getDate() - daysAgoEnd)

  console.log(`\nBatch ${idx + 1}/${total}: ${start.toLocaleDateString('pl-PL')} → ${end.toLocaleDateString('pl-PL')}`)

  const text = await callClaude(`Wygeneruj 20 wpisów do osobistego dziennika po polsku. Wpisy powinny być autentyczne i różnorodne.

Zakres dat: od ${start.toISOString().split('T')[0]} do ${end.toISOString().split('T')[0]}

Wymagania:
- Nastroje: rozłóż równomiernie: great, good, neutral, bad, terrible (po 4 każdy)
- Tematy: praca/kariera, relacje, samotność, melancholia, radość z małych rzeczy, stres, refleksje nad sobą, natura, codzienność, wspomnienia, lęki, marzenia
- Treść: 3-8 zdań, autentyczny głos dziennika, pierwsza osoba
- Różne godziny wpisów (rano, wieczór, noc)
- Tagi: 1-4 krótkich polskich tagów

Zwróć TYLKO tablicę JSON (bez markdown):
[{"title":"...","content":"...","mood":"good","tags":["tag1"],"created_at":"2024-03-15T09:30:00Z"}]`)

  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error(`Batch ${idx + 1}: brak JSON`)
  const entries = JSON.parse(match[0]) as SeedEntry[]
  console.log(`  ✓ ${entries.length} wpisów`)
  return entries
}

async function main() {
  console.log('🌱 Seed: 100 wpisów dziennika')
  console.log(`   User: ${USER_ID}\n`)

  const batches = [
    [90, 72], [72, 54], [54, 36], [36, 18], [18, 0],
  ] as [number, number][]

  const all: SeedEntry[] = []
  for (let i = 0; i < batches.length; i++) {
    const entries = await generateBatch(i, batches.length, batches[i][0], batches[i][1])
    all.push(...entries)
    if (i < batches.length - 1) await new Promise(r => setTimeout(r, 1500))
  }

  console.log(`\n📝 Wygenerowano: ${all.length} wpisów`)
  console.log('💾 Zapis do Supabase + embeddingi...\n')

  let saved = 0, failed = 0

  for (const entry of all) {
    try {
      const { data: inserted, error: ie } = await supabase
        .from('entries')
        .insert({
          user_id: USER_ID,
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          tags: entry.tags,
          created_at: entry.created_at,
          updated_at: entry.created_at,
        })
        .select('id')
        .single()
      if (ie) throw ie

      const embText = [entry.title, `nastrój: ${entry.mood}`, entry.tags.join(', '), entry.content].join('\n')
      const embedding = await generateEmbedding(embText)

      const { error: ue } = await supabase.from('entries').update({ embedding }).eq('id', inserted.id)
      if (ue) throw ue

      saved++
      process.stdout.write(`\r  ${saved}/${all.length}`)
    } catch (err) {
      failed++
      console.error(`\n  ✗ "${entry.title}":`, String(err).slice(0, 100))
    }

    // 50ms delay to stay under OpenAI rate limit
    await new Promise(r => setTimeout(r, 50))
  }

  console.log(`\n\n✅ Gotowe! Zapisano: ${saved}, błędy: ${failed}`)
}

main().catch(err => { console.error(err); process.exit(1) })
