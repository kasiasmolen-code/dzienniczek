# PRD: Aplikacja do Notatek "Dzienniczek"

## Executive Summary

Tworzymy mobilną i desktopową aplikację do notatek - dzienniczek, która umożliwi użytkownikom codzienne zapisywanie swoich myśli, zadań i obserwacji. Aplikacja będzie dostępna na telefon oraz skalować się na desktop z eleganckim, minimalistycznym designem inspirowanym iOS.

## Problem & Wizja

**Problem:** Użytkownicy szukają prostego narzędzia do tworzenia codziennych notatek z możliwością śledzenia swojego nastroju i organizacji wpisów za pomocą tagów.

**Wizja:** Stworzyć intuicyjną, przyjemną w użytkowaniu aplikację, która będzie zachęcać do codziennego pisania dziennika poprzez minimalistyczny design i przemyślaną UX.

## Scope MVP (Pierwsza Wersja)

### Funkcjonalności Kluczowe:
- ✅ Tworzenie nowego wpisu (tytuł + treść)
- ✅ Automatyczne zapisanie daty i godziny wpisu
- ✅ Wskaźnik nastroju (mood selector)
- ✅ Tagi do kategoryzacji wpisów
- ✅ Przeglądanie listy wszystkich wpisów
- ✅ Edycja istniejącego wpisu
- ✅ Usuwanie wpisu
- ✅ Dark mode (domyślnie)
- ✅ Responsywny design (mobile-first, skalowanie na desktop)

### Funkcjonalności na Później:
- 🔄 Autentykacja użytkownika (login/rejestracja)
- 🔄 Synchronizacja między urządzeniami (wymaga auth + backend)
- 🔄 Wyszukiwanie wpisów
- 🔄 Filtrowanie po tagach/nastroju

## Referencje Designu

Inspirujemy się projektem z dołączonej referencji:
- **Zaokrąglenia:** Wszystkie komponenty mają silnie zaokrąglone krawędzie (rounded-2xl, rounded-3xl)
- **Kształty:** Miękkie, organiczne kształty — pill buttons, duże rounded cards
- **Kolory (Dark Mode):**
  - Tło: ciemne
  - Karty/Surface: jasne kremowe (jak w referencji)
  - Buttony: `oklch(98.5% 0.001 106.423)` — świeży krem
- **Kolory (Light Mode):**
  - Buttony: `oklch(14.7% 0.004 49.25)` — ciemny krem
- **Typografia:** Czcionka **Poppins** — czytelna, geometryczna, przyjazna
- **Spacing:** Przejrzysty layout z dużym whitespace'em

## User Flows

### Flow 1: Tworzenie Wpisu
```
Home screen → [Button] Nowy wpis → New Entry screen →
Tytuł + Treść + Mood + Tagi → [Save] → Home screen (wpis na liście)
```

### Flow 2: Edycja Wpisu
```
Home screen → [Klik na wpis] → Entry Details →
[Edit button] → Edit Entry screen → Zmiana danych → [Save] → Home screen
```

### Flow 3: Usuwanie Wpisu
```
Entry Details → [Delete button] → Potwierdzenie → Usunięcie → Home screen
```

## Ekrany MVP

| Ekran | Opis |
|-------|------|
| **Home (Lista wpisów)** | Paginowana/scrollowana lista wpisów z preview'em, data, mood |
| **New Entry** | Tworzenie nowego wpisu (tytuł, treść, mood, tagi) |
| **Entry Details** | Pełny widok wpisu z opcjami edycji i usuwania |
| **Edit Entry** | Edycja istniejącego wpisu |

## Tech Stack

**Frontend:**
- **React** — biblioteka komponentów UI (bazowa warstwa)
- **Next.js** (App Router) — framework na React: routing, SSR, API routes, optymalizacje
- **shadcn/ui** — biblioteka gotowych komponentów UI
- **Tailwind CSS** — styling + dark mode
- **Poppins** — czcionka (Google Fonts)
- **Tiptap** — rich text editor do treści wpisów (formatowanie, listy, nagłówki itp.)

**State Management (MVP):**
- React state / Context API (dane tymczasowe w localStorage lub mock)

**Backend & Baza Danych (Później):**
- **Supabase** — PostgreSQL + autentykacja
- API Routes w Next.js lub osobny backend (do ustalenia)

**Deployment:**
- Vercel (naturalny wybór z Next.js)

## Design System

### Kolory
```
Dark mode (primary):
  Tło:          ciemne szaro/granatowe
  Surface/Card: kremowo-jasne
  Button:       oklch(98.5% 0.001 106.423)
  Tekst:        dostosowany do dark mode

Light mode:
  Button:       oklch(14.7% 0.004 49.25)
```

### Komponenty UI
| Komponent | Styl |
|-----------|------|
| Buttons | Pill-style, zaokrąglone, wyraźny shadow |
| Cards (Entry) | rounded-2xl/3xl, padding, lekki shadow |
| Input/Textarea | Zaokrąglone, jasne tło w dark mode |
| Mood Selector | Emoji picker — 5 stanów nastroju |
| Tag Input | Dynamiczne dodawanie tagów jako małe pile |

### Nastroje (Mood)
| Emoji | Label |
|-------|-------|
| 😄 | Świetnie |
| 🙂 | Dobrze |
| 😐 | Neutralnie |
| 😔 | Słabo |
| 😢 | Źle |

## Architektura Komponentów

```
app/
├── layout.tsx          — font Poppins, dark mode provider
├── page.tsx            — Home (lista wpisów)
├── new/
│   └── page.tsx        — Nowy wpis
├── [id]/
│   ├── page.tsx        — Szczegóły wpisu
│   └── edit/
│       └── page.tsx    — Edycja wpisu
└── components/
    ├── EntryCard.tsx       — Karta wpisu na liście
    ├── EntryForm.tsx       — Formularz (nowy + edycja)
    ├── MoodSelector.tsx    — Wybór nastroju
    ├── TagInput.tsx        — Dodawanie tagów
    └── DeleteConfirm.tsx   — Dialog potwierdzenia usunięcia
```

## Strategia Testowania

Po każdej wdrożonej funkcjonalności przeprowadzam **dwa rodzaje testów**:

### 1. Testy Manualne (UI)
Uruchamiam aplikację w przeglądarce i ręcznie weryfikuję:
- Złoty path (happy path) — czy funkcjonalność działa zgodnie z założeniem
- Edge case'y — np. pusty formularz, bardzo długi tekst, brak tagów
- Responsywność — widok mobilny i desktopowy
- Dark mode — czy wszystkie elementy wyglądają poprawnie

### 2. Testy Automatyczne (unit/integration)
Piszę testy automatyczne przy użyciu **Jest + React Testing Library**:
- Komponenty — czy renderują się poprawnie
- Logika — np. dodawanie/usuwanie tagów, walidacja formularza
- Interakcje — czy kliknięcia i zdarzenia działają zgodnie z oczekiwaniem

### Zasada
> Funkcjonalność jest uznana za ukończoną dopiero po przejściu obu rodzajów testów.

---

## Roadmap

### Phase 1: Setup & Design ← jesteśmy tutaj
- [x] Stworzenie PRD
- [ ] Inicjalizacja projektu Next.js
- [ ] Setup Tailwind CSS + shadcn/ui + Poppins
- [ ] Setup dark mode

### Phase 2: Frontend (Mock Data)
- [ ] Layout i nawigacja
- [ ] Home screen z mock'owanymi danymi
- [ ] New Entry screen
- [ ] Entry Details screen
- [ ] Edit Entry screen

### Phase 3: Dane Lokalne
- [ ] Persystencja w localStorage (tymczasowe)
- [ ] Pełny CRUD na wpisach

### Phase 4: Backend & Baza Danych
- [ ] Setup Supabase (PostgreSQL)
- [ ] API Routes w Next.js
- [ ] Migracja z localStorage na Supabase
- [ ] Autentykacja użytkowników

### Phase 5: Finalizacja MVP
- [ ] Testowanie responsywności (mobile + desktop)
- [ ] Poprawki designu
- [ ] Deployment na Vercel
