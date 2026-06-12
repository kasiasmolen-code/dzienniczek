# Wzorce — przepisy kompozycji ekranów

> Tu opisujemy **jak z klocków poskładać cały widok** (poziom ekranu, nie pojedynczy komponent). Komponenty → [`komponenty.md`](komponenty.md), tokeny → [`tokeny.md`](tokeny.md).
> Źródła: `app/layout.tsx`, `app/page.tsx`, `app/[id]/*`, `app/new`, `app/freud`.

---

## 1. Szkielet aplikacji (`app/layout.tsx`)

- `<html className="dark …">` — **dark-only, na sztywno**.
- Providery (kolejność): `AuthProvider` › `EntriesProvider` › `ConversationsProvider`.
- Globalne, renderowane raz pod treścią: `<BottomNav />` (mobile) i `<FreudFloating />`.
- Font `body` = Poppins (antialiased).

Każdy nowy ekran to `children` w tym layoucie — **nie** dubluj nawigacji ani providerów.

---

## 2. Kontener strony

Wąski, wyśrodkowany ekran treści (podgląd wpisu, formularz):

```tsx
<main className="min-h-screen bg-background px-6 md:px-8 pb-10 max-w-2xl mx-auto">
```

- Padding poziomy zawsze `px-6 md:px-8`.
- Szerokość: **`max-w-2xl`** dla ekranów treści; **`max-w-4xl`** (mobile) / siatka `max-w-5xl` (desktop) dla list wpisów.
- Dół: zostaw miejsce na BottomNav (`pb-10` lub pusty `<div className="h-28" />` na końcu listy).

---

## 3. Nagłówek + Wstecz

Pasek górny z nawigacją wstecz i akcjami:

```tsx
<div className="flex items-center justify-between pt-8 mb-10">
  <Button variant="ghost" size="default" onClick={() => router.push('/')}>
    <ChevronLeftIcon className="size-4" /> Wstecz
  </Button>
  <div className="flex gap-2">
    <Button variant="secondary" size="lg">Edytuj</Button>
    <Button variant="destructive" size="lg">Usuń</Button>
  </div>
</div>
```

- Start sekcji zawsze `pt-8`. Przycisk wstecz wg standardu z [`komponenty.md`](komponenty.md).
- Wariant „lista" (home): zamiast Wstecz — tytuł `text-4xl md:text-5xl font-black` + licznik `text-muted text-sm`, po prawej akcja drugorzędna (`Wyloguj`).

---

## 4. Nawigacja — mobile vs desktop

Wzorzec responsywny: te same dane, dwa układy (`lg:hidden` / `hidden lg:flex`).

- **Mobile (`< lg`):** treść w kontenerze + pływający `BottomNav` (pigułka + FAB Freud).
- **Desktop (`≥ lg`):** lewy panel boczny zamiast BottomNav:
  ```tsx
  <aside className="w-60 shrink-0 flex flex-col border-r border-foreground/10 h-full px-4 py-6">
  ```
  Zawiera: nazwę apki (`text-lg font-black`), przycisk „Nowy wpis" (`bg-foreground text-background rounded-lg`), linki nawigacji (`px-3 py-2.5 rounded-lg`, aktywny `bg-foreground/8`), sekcję dolną `mt-auto` (Docs, Wyloguj).

---

## 5. Lista wpisów (`app/page.tsx`)

- Siatka: `grid grid-cols-1 md:grid-cols-2 gap-4` (mobile), `grid grid-cols-2 xl:grid-cols-3 gap-4` (desktop main).
- Element = `<EntryCard entry={…} index={i} />` — kolor karty rotuje się po `index`.
- Stan pusty: wyśrodkowana kolumna `📝` + `text-foreground font-semibold` + podpowiedź `text-muted text-sm`.

---

## 6. Ekran treści wpisu (`app/[id]/page.tsx`)

Kolejność bloków w kontenerze `max-w-2xl`:
1. Pasek nagłówka (Wstecz + Edytuj/Usuń).
2. Tytuł `text-4xl font-black` + emoji nastroju (`text-4xl`).
3. Data `text-sm text-muted mb-8`.
4. Treść `text-base leading-relaxed whitespace-pre-wrap`.
5. (opcjonalnie) zdjęcie `rounded-lg`.
6. Tagi `flex flex-wrap gap-2` — `bg-foreground/10 px-3 py-1 rounded-full text-sm`.
7. `<DeleteConfirm />` sterowany stanem `showDelete`.

---

## 7. Formularz (`app/new`, `app/[id]/edit`)

- Renderuj `<EntryForm />` w kontenerze `max-w-2xl` z paskiem Wstecz.
- `new` → bez autosave; `edit` → `initial={entry}` + autosave.
- Pola-bloki: `bg-foreground/5 rounded-2xl p-4`; MoodSelector i TagInput jako gotowe klocki.

---

## 8. Panel Freuda (`app/freud`, `FreudFloating`)

- Pływający panel: `fixed inset-y-0 right-0 w-full sm:w-96 z-40 bg-background border-l flex flex-col`.
- Górny pasek z historią (`History`, `ChevronLeft`), lista konwersacji (`rounded-3xl`), `FreudChat` z inputem dolnym `p-4 border-t`.
- BottomNav chowa się na `/freud`.

---

## Jak dodać wzorzec (rozszerzalność)

Dopisując nowy przepis ekranu: zacznij od kontenera (sekcja 2), użyj nagłówka ze standardem Wstecz (sekcja 3), składaj wyłącznie z klocków z [`komponenty.md`](komponenty.md) i tokenów z [`tokeny.md`](tokeny.md). Jeśli ekran ma wariant mobile/desktop — opisz oba (jak sekcja 4). Nie wprowadzaj nowych marginesów/kolorów spoza kontraktu.
