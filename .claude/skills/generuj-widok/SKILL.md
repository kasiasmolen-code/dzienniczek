---
name: generuj-widok
description: Generuj lub aktualizuj widoki i komponenty UI spójne z design systemem projektu, korzystając z kuratorowanej allowlisty z references/. Użyj gdy użytkownik mówi "generuj widok", "stwórz ekran", "nowy widok", "zbuduj stronę", "dodaj ekran", "stwórz komponent" — albo gdy chce skonfigurować/ustawić design system w projekcie ("skonfiguruj design system", "ustaw reguły designu", "zbuduj kontrakt designu"). Skill ma dwa tryby: KONFIGURACJA (buduje references/ przez wywiad, gdy ich nie ma) i GENEROWANIE (składa widok z allowlisty, gdy references/ istnieją).
---

# Skill: generuj-widok

Buduj UI **wyłącznie z kuratorowanej allowlisty** zapisanej w `references/` tego skilla.
To jest obrona przed halucynacją: nie wymyślasz komponentów ani tokenów — sięgasz po
zamkniętą listę. Jeśli czegoś na liście nie ma, **zatrzymujesz się** i proponujesz
dopisanie, zamiast zgadywać.

Skill jest **generyczny** — nie zawiera wartości specyficznych dla żadnego projektu.
Wszystko, co projektowe (kolory, komponenty, wzorce), żyje w `references/`. Dzięki temu
ten sam skill działa w każdym projekcie.

## Krok 0 — wykryj tryb

Sprawdź, czy istnieje katalog `references/` obok tego pliku (`tokeny.md`, `komponenty.md`,
`wzorce.md`):

- **Brak `references/`** (lub puste) → **Tryb A: KONFIGURACJA**.
- **`references/` istnieją** → **Tryb B: GENEROWANIE**.

Użytkownik może wymusić tryb słowami: „skonfiguruj design system" → A; „stwórz ekran…" → B.

---

## Tryb A — KONFIGURACJA (zbuduj `references/` dla tego projektu)

Cel: zebrać zasoby projektu i wygenerować kontrakt designu (to samo, co zostało zrobione
ręcznie dla projektu wzorcowego — patrz `references/` jako „złoty wzorzec" wyjścia).

### A1. Wywiad — zapytaj o zasoby (jedno pytanie na raz)

1. **Figma** — „Podaj link lub fileKey pliku Figmy z design systemem (źródło prawdy).
   Opcjonalnie node-id kluczowego komponentu, np. Buttona — albo wyszukam sam."
2. **Kod — komponenty** — „Gdzie są komponenty UI? (np. `components/ui/`)"
3. **Kod — tokeny** — „Gdzie są zdefiniowane tokeny/motyw? (np. `app/globals.css`, blok
   `@theme`, plik snapshotu zmiennych)"
4. **Kod — mapa/reguły** — „Czy jest plik z regułami/mapą folderów? (np. `CLAUDE.md`)"
5. **Reguły** — „Tryb dark/light czy oba? Biblioteka ikon? Font? Zasady zaokrągleń?"

### A2. Zbierz dane (read-only)

- **Z Figmy** (skille/MCP Figmy): `get_variable_defs` (kolory, radius, spacing, typografia
  — w tym `heading 1–4`, `paragraph/*`), `search_design_system` (komponenty, jeśli brak
  node-id), `get_screenshot` (referencje wizualne).
- **Z kodu:** przeczytaj pliki tokenów i komponentów ze ścieżek z wywiadu.

### A3. Mini-audit

Porównaj kod ↔ Figma w 3 warstwach: zmienne (żywe z Figmy vs kod), komponenty (warianty),
reguły. Zanotuj rozjazdy (ta sama nazwa, inna wartość / brak / osierocone) — wpiszemy je
jawnie w kontrakcie, nie ukrywamy.

### A4. Wygeneruj `references/` + `assets/`

Zapisz pliki (struktura jak w „złotym wzorcu"):
- `references/tokeny.md` — kolory, radius, spacing, typografia (wartości z Figmy) + zasada
  „zakaz surowych HEX".
- `references/komponenty.md` — **Tier 1** prymitywy DS (z mapowaniem nazw Figma→kod, np.
  Primary→`default`) + **Tier 2** komponenty aplikacji (reużywalne klocki).
- `references/wzorce.md` — przepisy kompozycji ekranów (kontener, nagłówek, nawigacja…).
- `assets/przyklady/README.md` — fileKey + node-id do **odtwarzalnych** screenów (nie
  zamrożone PNG).
- Każdy plik z sekcją „Jak dodać…" (kontrakt rozszerzalny).
- (opcjonalnie) zaproponuj reguły do `CLAUDE.md` — jeśli dostępny skill
  `figma-create-design-system-rules`, użyj go; jeśli nie, wygeneruj regułę samodzielnie.

### A5. Podsumowanie
Pokaż, co powstało i jakie rozjazdy wykryto. Powiedz: „Kontrakt gotowy — możesz teraz
prosić o generowanie widoków (Tryb B)."

---

## Tryb B — GENEROWANIE (złóż widok z allowlisty)

### B1. Przeczytaj kontrakt (OBOWIĄZKOWE, progressive disclosure)
Najpierw wczytaj `references/tokeny.md`, `references/komponenty.md`, `references/wzorce.md`.
**Nie generuj z pamięci** — zawsze z aktualnej treści tych plików.

### B2. Zrozum żądanie
Jaki ekran/komponent? Wariant mobile/desktop? Jakie dane/akcje?

### B3. Sprawdź wzorce
W `wzorce.md` poszukaj gotowego przepisu kompozycji (kontener, nagłówek + „Wstecz",
nawigacja, siatka) do reużycia.

### B4. Złóż z klocków allowlisty
- Używaj **wyłącznie** komponentów z `komponenty.md` (Tier 1 + Tier 2) i tokenów z
  `tokeny.md`.
- Trzymaj reguły z kontraktu (mapowanie Figma→kod, ikony, font, `rounded-lg` dla
  przycisków/pól).
- Plik trafia w miejsce zgodne z mapą folderów projektu (`app/…` strony, `components/…`
  komponenty).

### B5. BRAMKA antyhalucynacyjna (najważniejsze)
Jeśli potrzebny komponent / token / wariant **nie jest** w `references/`:
**ZATRZYMAJ SIĘ. Nie wymyślaj.** Powiedz, czego brakuje, i zaproponuj dopisanie do
kontraktu (sekcje „Jak dodać…"). Generuj dopiero po uzupełnieniu allowlisty.

### B6. Weryfikacja w przeglądarce (obowiązkowa)
Zgodnie z globalną regułą „enable Figma Visual Preview" + harnessem: odśwież preview,
sprawdź render i brak błędów w konsoli, zrób screenshot jako dowód.

### B7. (Opcjonalnie) round-trip kod→Figma
Tylko na wyraźną prośbę. Deleguj do skilli Figmy: `figma-generate-design` (układa widok z
instancji komponentów) + **obowiązkowo** `figma-use` przed każdym `use_figma`. Uwaga: Code
Connect (auto-mapowanie) bywa niedostępny na planie Pro — round-trip działa, ale bez niego.

---

## Zasada współpracy ze skillami Figmy

Ten skill = **kuratorowana bramka projektu** (co wolno). Skille Figmy = **silnik** (jak
czytać/pisać Figmę). Nie dubluj ich:
- ściąganie tokenów/komponentów → `get_variable_defs`, `search_design_system`;
- reguły projektu → `figma-create-design-system-rules`;
- push do Figmy → `figma-generate-design` + `figma-use`;
- implementacja z istniejącego frame'a (design→code) → `figma-implement-design` /
  `get_design_context`, ale ZAWSZE filtruj wynik przez allowlistę `references/`.
