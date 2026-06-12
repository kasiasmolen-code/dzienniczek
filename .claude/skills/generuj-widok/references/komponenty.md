# Komponenty — allowlista klocków Dzienniczka

> **To jest kuratorowana allowlista** — zamknięte menu komponentów, których używamy. Obra kit ma setki wariantów; tu są tylko te realnie używane. Jeśli czegoś nie ma na liście — nie używaj „od siebie", najpierw dopisz (patrz sekcja „Jak dodać komponent").
> Dwa poziomy: **Tier 1** = prymitywy design systemu (z Figmy, źródło prawdy). **Tier 2** = komponenty aplikacji (reużywalne klocki złożone z Tier 1 + tokenów).

---

## Tier 1 — Prymitywy design systemu (`components/ui/`)

### Button — `components/ui/button.tsx`

**Krytyczne mapowanie nazw Figma → kod** (główne źródło halucynacji — Figma nazywa inaczej niż kod):

| Figma | kod (`variant=`) |
|---|---|
| Primary | `default` |
| Secondary | `secondary` |
| Outline | `outline` |
| Ghost | `ghost` |
| Destructive | `destructive` |

**Mapowanie rozmiarów Figma → kod (`size=`):**

| Figma | kod | wysokość |
|---|---|---|
| Default | `lg` | 36px |
| Large | `xl` | 40px |
| Small | `default` | 32px |
| Mini | `xs` | 24px |
| Extra Large | `2xl` | 48px |

> `sm` i `icon*` to warianty pośrednie shadcn bez bezpośredniego odpowiednika w Figmie.

**Standard przycisków akcji (z `CLAUDE.md` — obowiązkowy):**

| Akcja | `variant` | `size` | Ikona |
|---|---|---|---|
| Główna / primary | `default` | `default` | — |
| Drugorzędna | `secondary` | `lg` | — |
| Destrukcyjna (usuń, reset) | `destructive` | `lg` | — |
| Nawigacja wstecz | `ghost` | `default` | `ChevronLeftIcon` (`@heroicons/react/24/outline`) + tekst „Wstecz" |

- Wszystkie przyciski → `rounded-lg` (wbudowane w wariant, nie nadpisuj).
- Przycisk „Wstecz" zawsze przez `<Button variant="ghost" size="default">`, nigdy surowy `<button>`, nigdy inna ikona (lucide / emoji / `←`).

```tsx
// Wstecz — wzorzec referencyjny (app/[id]/page.tsx)
<Button variant="ghost" size="default" onClick={() => router.push('/')}>
  <ChevronLeftIcon className="size-4" />
  Wstecz
</Button>
```

### Dialog — `components/ui/dialog.tsx`

Eksport: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`, `DialogOverlay`, `DialogPortal`.

- **Overlay:** `fixed inset-0 z-50 bg-black/10` + `backdrop-blur-xs`.
- **Content:** `rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10`, wyśrodkowany, `max-w-sm`. Uwaga: `popover` jest jasny (`#FFFFFF`) nawet w dark.
- **Title:** `font-heading text-base font-medium`. **Description:** `text-sm text-muted-foreground`.
- **Footer:** `flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t bg-muted/50`.
- Użycie referencyjne: `DeleteConfirm` (Tier 2).

---

## Tier 2 — Komponenty aplikacji (`components/`)

Reużywalne klocki złożone z Tier 1 + tokenów. Każdy to gotowy element do składania ekranów.

### EntryCard — `components/EntryCard.tsx`
Karta wpisu na liście. **Props:** `entry`, `index`.
- Kontener: `p-6 rounded-3xl active:scale-95 md:hover:scale-[1.02] transition-transform`.
- 5 wariantów koloru rotowanych po `index % 5` (`CARD_STYLES`): `surface` (neutral), `card-orange`, `card-yellow`, `card-green`, `card-blue`. Na kolorowych tekst `text-white`, na surface/yellow `text-surface-foreground`.
- Składniki: `DateBlock` (`rounded-2xl bg-black/10 px-3 py-2`, dzień skrótem PL), tytuł `text-xl font-bold`, emoji nastroju (`moodEmoji`), data względna `text-sm`, treść `line-clamp-2`, tagi `px-3 py-1 rounded-full text-xs`.

### EntrySidebar — `components/EntrySidebar.tsx`
Lista wpisów w panelu bocznym (desktop). Reużywa `CARD_STYLES` z EntryCard, mini-karty `rounded-3xl`, zaznaczenie `ring-2 ring-white/30`.

### MoodSelector — `components/MoodSelector.tsx`
Wybór nastroju — 5 przycisków emoji. **Props:** `value`, `onChange`. Eksportuje też `MOODS` i `moodEmoji()`.
- Stany: `terrible 😢 / bad 😔 / neutral 😐 / good 🙂 / great 😄` (etykiety PL).
- Przycisk: `flex-1 py-3 rounded-2xl`; zaznaczony `bg-foreground/10 scale-105`, reszta `opacity-40`. Label `text-xs text-muted`.

### TagInput — `components/TagInput.tsx`
Pole tagów. **Props:** `value`, `onChange`.
- Kontener: `p-3 bg-foreground/5 rounded-2xl min-h-12`. Tag: `bg-foreground/15 text-foreground px-3 py-1 rounded-full text-sm` z przyciskiem `×`. Input transparentny, dodawanie Enter/`,`.

### BottomNav — `components/BottomNav.tsx`
Dolna nawigacja (mobile, `lg:hidden`, `fixed bottom-0 z-50`).
- Pigułka: `h-14 bg-foreground/90 backdrop-blur-sm rounded-full px-2 shadow-xl` z 3 ikonami (`HomeIcon`, `PlusIcon`, `BookOpenIcon` — heroicons), aktywny `bg-white/20`.
- FAB Freud: `w-14 h-14 rounded-full bg-foreground/90 text-background` z ikoną `Brain` (lucide).
- Ukrywa się na `/login`, `/freud`.

### DeleteConfirm — `components/DeleteConfirm.tsx`
Modal potwierdzenia usunięcia. **Props:** `open`, `onConfirm`, `onCancel`. Złożony z `Dialog` + `Button` (`destructive` do potwierdzenia, `secondary`/`ghost` do anulowania).

### EntryForm — `components/EntryForm.tsx`
Formularz tworzenia/edycji. Składa: `MoodSelector` + `TagInput` + textarea (`bg-foreground/5 rounded-2xl p-4`) + upload (ikony `PhotoIcon`, `Mic`). Obsługuje autosave (edycja) i upload zdjęć/głosu.

### FreudFloating — `components/FreudFloating.tsx`
Pływający panel czatu z Freudem. Panel `fixed inset-y-0 right-0 w-full sm:w-96 z-40 bg-background border-l`. Ikony lucide (`History`, `Plus`, `Trash2`, `X`, `ChevronLeft`). Wczytuje `FreudChat`.

### FreudChat — `components/FreudChat.tsx`
Interfejs czatu AI (`useChat`, `ReactMarkdown`). Wiadomości w kolumnach user/assistant, input dolny `p-4 border-t flex gap-2`, send z ikoną `Send`/`Loader2` (lucide).

---

## Ikony — REGUŁA: tylko heroicons

- **Stosujemy wyłącznie `@heroicons/react/24/outline`** (zgodnie z `CLAUDE.md`). Obowiązkowy `ChevronLeftIcon` we „Wstecz". Nowych widoków NIE buduj z lucide ani emoji.
- ✅ **Wdrożone (2026-06-11):** całość kodu przepięta lucide→heroicons. Mapowanie referencyjne: `Send`→`PaperAirplaneIcon`, `Mic`→`MicrophoneIcon`, `Loader2`→`ArrowPathIcon` (spin), `Trash2`→`TrashIcon`, `X`→`XMarkIcon`, `Plus`→`PlusIcon`, `History`→`ClockIcon`, `Home`→`HomeIcon`, `BookOpen`→`BookOpenIcon`, `LogOut`→`ArrowRightOnRectangleIcon`, `Menu`→`Bars3Icon`, `ChevronRight`→`ChevronRightIcon`.
- ⚠️ **Dwa wyjątki w lucide** (brak odpowiednika w heroicons 24/outline): `Brain` (FAB/awatar Freuda) i `MicOff` (stan „nagrywanie — kliknij by zatrzymać" w EntryForm). Zostają do czasu wskazania zamiennika.
- Heroicons nie przyjmują propa `size={n}` — rozmiar przez klasę (`className="size-[18px]"` / `w-4 h-4`).

---

## Jak dodać komponent (rozszerzalność)

- **Tier 1 (prymityw DS):** musi istnieć w Obra kit. Sprawdź `search_design_system`, dodaj komponent do `components/ui/`, zapisz mapowanie nazw Figma→kod (jak Button: Primary→default). Docelowo: Code Connect (`*.figma.tsx`) — krok 3 architektury.
- **Tier 2 (komponent aplikacji):** dopisz kartę wg schematu: **nazwa + ścieżka**, do czego służy, **Props**, z jakich prymitywów/tokenów złożony, kluczowe klasy, ikony. Buduj wyłącznie z Tier 1 + tokenów z [`tokeny.md`](tokeny.md).
