import type { Entry } from './types'

const MOOD_PL: Record<string, string> = {
  great: 'świetny',
  good: 'dobry',
  neutral: 'neutralny',
  bad: 'zły',
  terrible: 'bardzo zły',
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function moodPL(mood: string | null | undefined): string {
  return mood ? (MOOD_PL[mood] ?? mood) : 'nieokreślony'
}

export function buildSystemPrompt(
  entries: Entry[],
  activeEntry?: Entry | null,
  relevantEntries?: Entry[],
  therapistSystemPrompt?: string | null
): string {
  const summary = entries
    .slice(0, 50)
    .map(e => {
      const date = new Date(e.created_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
      const mood = moodPL(e.mood)
      return `- ${date}: "${e.title}" (nastrój: ${mood})`
    })
    .join('\n')

  const activeSection = activeEntry
    ? `\nAktualnie otwarty wpis użytkownika (przeanalizuj go szczególnie uważnie):
Data: ${new Date(activeEntry.created_at).toLocaleDateString('pl-PL', { dateStyle: 'long' })}
Nastrój: ${moodPL(activeEntry.mood)}
Tytuł: ${activeEntry.title}
Treść:
${activeEntry.content || '(brak treści)'}
${activeEntry.tags.length > 0 ? `Tagi: ${activeEntry.tags.map(t => '#' + t).join(', ')}` : ''}`
    : ''

  const relevantSection = relevantEntries?.length
    ? `\nWpisy najbardziej powiązane z aktualnym pytaniem użytkownika (wyszukiwanie semantyczne — przeczytaj uważnie i nawiązuj do nich w odpowiedzi):
${relevantEntries.map(e => `---
Data: ${formatDate(e.created_at)} | Nastrój: ${moodPL(e.mood)} | Tytuł: ${e.title}
${e.tags.length > 0 ? `Tagi: ${e.tags.map(t => '#' + t).join(', ')}\n` : ''}${e.content || '(brak treści)'}`).join('\n')}`
    : ''

  const persona = therapistSystemPrompt?.trim()
    ? therapistSystemPrompt.trim()
    : `Jesteś Freudem — empatycznym asystentem terapeutycznym wbudowanym w dziennik osobisty użytkownika.

Twoje zasady:
- Aktywnie słuchaj i waliduj emocje użytkownika
- Zadawaj otwarte pytania pogłębiające refleksję nad uczuciami
- Identyfikuj wzorce nastroju i nawiązuj do konkretnych wpisów z historii
- Nigdy nie stawiasz diagnozy medycznej — jesteś wsparciem emocjonalnym, nie psychiatrą
- Jeśli użytkownik wspomina o myślach samobójczych lub krzywdzeniu siebie, delikatnie zachęć do kontaktu z profesjonalistą
- Piszesz wyłącznie po polsku, ciepło, bez żargonu psychologicznego
- Jesteś zwięzły — odpowiedzi max 3-4 zdania, chyba że użytkownik prosi o więcej`

  return `${persona}

Historia wpisów użytkownika (skrót ostatnich 50):
${summary || 'Brak wpisów w historii.'}
${activeSection}${relevantSection}

Przy pierwszej wiadomości w rozmowie: przywitaj się ciepło i nawiąż do ostatnich wpisów lub aktualnie otwartego wpisu. Zadaj jedno otwarte pytanie.`
}
