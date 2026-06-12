# Claude Instructions — Dzienniczek

## Mapa Folderów

```
/                              ← root: konfiguracja projektu
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── components.json            ← konfiguracja shadcn/ui
├── figma-variables-snapshot.json  ← ŹRÓDŁO PRAWDY dla tokenów designu
├── figma-design-system-overview.md
│
├── app/                       ← Next.js App Router
│   ├── page.tsx               ← strona główna (lista wpisów)
│   ├── layout.tsx             ← root layout
│   ├── globals.css            ← style globalne + blok @theme (tokeny CSS)
│   ├── [id]/                  ← podgląd wpisu (dynamiczny)
│   │   ├── page.tsx
│   │   └── edit/page.tsx      ← edycja wpisu
│   ├── new/page.tsx           ← tworzenie nowego wpisu
│   ├── login/page.tsx         ← logowanie / rejestracja
│   ├── freud/page.tsx         ← czat z Freudem (AI)
│   ├── docs/page.tsx          ← dokumentacja API
│   └── api/                   ← route handlersy (server-side)
│       ├── chat/              ← czat (AI SDK)
│       ├── entries/           ← CRUD wpisów
│       ├── freud/             ← Freud AI
│       ├── mcp/               ← Model Context Protocol
│       ├── transcribe/        ← transkrypcja głosu
│       └── openapi.json       ← specyfikacja OpenAPI
│
├── components/
│   ├── ui/                    ← komponenty shadcn/ui
│   │   ├── button.tsx
│   │   └── dialog.tsx
│   ├── EntryForm.tsx          ← formularz tworzenia wpisu
│   ├── EntryCard.tsx          ← karta pojedynczego wpisu
│   ├── EntrySidebar.tsx       ← panel boczny z listą wpisów
│   ├── MoodSelector.tsx       ← wybór nastroju
│   ├── TagInput.tsx           ← pole tagów
│   ├── FreudChat.tsx          ← interfejs czatu z Freudem
│   ├── FreudFloating.tsx      ← pływający przycisk Freuda
│   ├── BottomNav.tsx          ← dolna nawigacja
│   └── DeleteConfirm.tsx      ← modal potwierdzenia usunięcia
│
├── lib/                       ← logika biznesowa i narzędzia
│   ├── types.ts               ← typy TypeScript
│   ├── utils.ts               ← funkcje pomocnicze
│   ├── supabase.ts            ← klient Supabase (client-side)
│   ├── auth-context.tsx       ← kontekst autentykacji
│   ├── entries-context.tsx    ← stan wpisów
│   ├── conversations-context.tsx ← stan konwersacji czatu
│   ├── freud-prompt.ts        ← system prompt dla Freuda
│   ├── openapi.ts             ← generator schematu OpenAPI
│   ├── useVoiceRecorder.ts    ← hook nagrywania głosu
│   └── api/                   ← narzędzia server-side
│       ├── middleware.ts
│       ├── supabase-server.ts ← klient Supabase (server-side)
│       ├── types.ts
│       └── validators.ts      ← walidacja Zod
│
├── public/                    ← statyczne assety (SVG)
└── design/                    ← zasoby designu
```

## Główne Komendy

```bash
npm run dev      # uruchom serwer developerski → http://localhost:3000
npm run build    # zbuduj wersję produkcyjną
npm run start    # uruchom zbudowaną wersję produkcyjną
```

## Zasady Projektowe UX/UI

> **Kontrakt designu (allowlista):** pełna, kuratorowana lista tokenów, komponentów i wzorców
> kompozycji jest w `.claude/skills/generuj-widok/references/` (`tokeny.md`, `komponenty.md`,
> `wzorce.md`). To **źródło prawdy przy generowaniu/edycji UI** — buduj wyłącznie z tej
> allowlisty (m.in. tylko Poppins, tylko `@heroicons/react/24/outline`). Do generowania
> widoków służy skill `generuj-widok`.

### Źródło prawdy dla tokenów

Wszystkie nazwy zmiennych semantycznych, kolorów, odstępów (spacing) i cieni **MUSZĄ** być sprawdzane i mapowane bezpośrednio z pliku `figma-variables-snapshot.json`. Masz kategoryczny zakaz wymyślania własnych nazw klas spoza tego pliku.

### Zakaz surowych kolorów

Zakaz używania surowych kolorów HEX czy standardowych szarości Tailwinda (np. `gray-500`, `#3b3b3b`) w kodzie komponentów. Zawsze mapuj je na zmienne z bloku `@theme` na podstawie pliku JSON (np. `bg-primary`, `text-foreground`, `bg-muted`, `text-muted-foreground`).

### Zasada zaokrągleń

Wszystkie przyciski (`<button>`, komponenty `Button`) oraz pola formularzy (`<input>`, `<textarea>`) **MUSZĄ** używać wyłącznie semantycznej klasy `rounded-lg`.

Mapowanie potwierdzone w `figma-variables-snapshot.json` (kolekcja `border_radii_relative`):
- `rounded-lg` → alias `radius-8` → **8px**

Zakaz stosowania innych klas zaokrągleń (`rounded-full`, `rounded-md`, `rounded-sm`, `rounded-xl` itp.) dla przycisków i pól formularzy.

### Standard: przyciski akcji

| Akcja | Wariant | Rozmiar | Ikona |
|---|---|---|---|
| Główna / primary | `default` | `default` | — |
| Drugorzędna / secondary | `secondary` | `lg` | — |
| Destrukcyjna (usuń, reset) | `destructive` | `lg` | — |
| Nawigacja wstecz | `ghost` | `default` | `ChevronLeftIcon` z `@heroicons/react/24/outline` przed tekstem |

**Zasada nawigacji wstecz:** każdy przycisk powrotu do poprzedniego ekranu MUSI być `<Button variant="ghost" size="default">` z `ChevronLeftIcon` i tekstem "Wstecz". Zakaz używania surowych `<button>` dla akcji nawigacji wstecz. Zakaz używania innych ikon (lucide, emoji, strzałka ←).
