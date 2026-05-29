# 📓 Dzienniczek

Minimalistyczna aplikacja do codziennych notatek — zapisuj myśli, śledź nastrój, organizuj wpisy tagami.

## Demo

> Aplikacja uruchomiona lokalnie na `http://localhost:3000`

## Funkcje

- ✍️ **Tworzenie wpisów** — tytuł, treść, data i godzina zapisywane automatycznie
- 😄 **Mood selector** — opcjonalny wybór nastroju (skala od Źle do Świetnie)
- 🏷️ **Tagi** — kategoryzacja wpisów dynamicznie dodawanymi tagami
- ✏️ **Edycja i usuwanie** — pełny CRUD na wpisach
- 🌑 **Dark mode** — domyślnie aktywny
- 📱 **Responsywny design** — mobile-first, skaluje się na tablet i desktop

## Tech Stack

| Warstwa | Technologia |
|---------|-------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + shadcn/ui |
| Styling | Tailwind CSS v4 |
| Język | TypeScript |
| Czcionka | Poppins (Google Fonts) |
| State | React Context + localStorage |

## Uruchomienie

```bash
# Instalacja zależności
npm install

# Dev server
npm run dev
```

Aplikacja dostępna pod `http://localhost:3000`.

## Struktura projektu

```
app/
├── layout.tsx          — font Poppins, dark mode provider
├── page.tsx            — Home (lista wpisów)
├── new/
│   └── page.tsx        — Nowy wpis
└── [id]/
    ├── page.tsx        — Szczegóły wpisu
    └── edit/
        └── page.tsx    — Edycja wpisu

components/
├── EntryCard.tsx       — Karta wpisu na liście
├── EntryForm.tsx       — Formularz (nowy + edycja)
├── MoodSelector.tsx    — Wybór nastroju
├── TagInput.tsx        — Dodawanie tagów
└── DeleteConfirm.tsx   — Dialog potwierdzenia usunięcia

lib/
├── types.ts            — Typy (Entry, Mood)
├── entries-context.tsx — Globalny stan wpisów
└── utils.ts            — Formatowanie dat
```

## Roadmap

- [x] Phase 1 — Setup & Design System
- [x] Phase 2 — Frontend z React state (mock data)
- [ ] Phase 3 — Persystencja w localStorage
- [ ] Phase 4 — Backend: Supabase + autentykacja
- [ ] Phase 5 — Deployment na Vercel
