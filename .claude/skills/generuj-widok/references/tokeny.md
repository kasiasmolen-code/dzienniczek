# Tokeny — kontrakt designu Dzienniczka

> **Źródło prawdy:** Figma Obra shadcn/ui kit (`ZcP3u9vSI9pkj3tNhFL70X`) → `figma-variables-snapshot.json` → blok `@theme` w `app/globals.css`.
> **Zasada nadrzędna:** nigdy nie używaj surowych HEX-ów ani szarości Tailwinda (`gray-500`, `#3b3b3b`). Każdy kolor/odstęp/radius mapuj na token semantyczny poniżej.
> **Aplikacja jest dark-only** (`<html className="dark">` na sztywno) — podajemy wartości trybu dark. Light istnieje w kodzie, ale nigdy się nie renderuje.

---

## 1. Kolory semantyczne (dark)

Używaj jako klas Tailwind: `bg-<token>`, `text-<token>`, `border-<token>`. Klasa wynika z nazwy `--color-*` w `@theme`.

| Klasa (`bg-`/`text-`) | Token CSS | HEX (dark) | Rola |
|---|---|---|---|
| `background` | `--background` | `#0A0A0A` | Główne tło strony |
| `foreground` | `--foreground` | `#FAFAFA` | Główny tekst |
| `primary` | `--primary` | `#F5F5F5` | Tło przycisku primary, akcent |
| `primary-foreground` | `--primary-foreground` | `#0A0A0A` | Tekst na primary |
| `secondary` | `--secondary` | `#262626` | Tło przycisku secondary |
| `secondary-foreground` | `--secondary-foreground` | `#F5F5F5` | Tekst na secondary |
| `muted` | `--muted` | `#171717` | Stonowane tło |
| `muted-foreground` | `--muted-foreground` | `#A3A3A3` | Tekst pomocniczy, placeholder |
| `accent` | `--accent` | `#171717` | Tło hover elementów interaktywnych |
| `accent-foreground` | `--accent-foreground` | `#F5F5F5` | Tekst na accent |
| `destructive` | `--destructive` | `#991B1B` | Akcje destrukcyjne (usuń, błąd) — `red/800` |
| `destructive-foreground` | `--destructive-foreground` | `#FFFFFF` | Tekst na destructive |
| `border` | `--border` | `#404040` | Obramowania komponentów |
| `input` | `--input` | `rgb(255 255 255 / .05)` | Tło/border pól formularzy |
| `ring` | `--ring` | `#404040` | Focus ring (a11y) |
| `card` | `--card` | `#171717` | Tło karty |
| `card-foreground` | `--card-foreground` | `#FFFFFF` | Tekst w karcie |
| `popover` | `--popover` | `#FFFFFF` | Tło popover/dialog (uwaga: jasne!) |
| `popover-foreground` | `--popover-foreground` | `#000000` | Tekst w popover |
| `sidebar` | `--sidebar` | `#0A0A0A` | Tło panelu bocznego |
| `sidebar-foreground` | `--sidebar-foreground` | `#D4D4D4` | Tekst w panelu bocznym |

> Pełna lista sidebar-* i chart-* jest w `globals.css` — dopisuj tu tylko te, których realnie używasz w widoku.

### 1a. Tokeny app-specific (spoza shadcn, w `@theme`)

| Klasa | Token | HEX (dark) | Rola |
|---|---|---|---|
| `surface` | `--surface` | `#171717` | Dymki czatu Freuda, karty neutralne |
| `surface-foreground` | `--surface-foreground` | `#FFFFFF` | Tekst na surface |
| `card-orange` | `--card-orange` | `#EA580C` | Akcent karty wpisu — `orange/600` |
| `card-yellow` | `--card-yellow` | `#D97706` | Akcent karty wpisu — `amber/600` |
| `card-green` | `--card-green` | `#16A34A` | Akcent karty wpisu — `green/600` |
| `card-blue` | `--card-blue` | `#0284C7` | Akcent karty wpisu — `sky/600` |

> Akcenty kart to aliasy raw→semantic (light=Tailwind 400, dark=600). Round-trip do Figmy wykonany (kolekcja `journal/*`). Na kolorowych kartach tekst jest biały (`text-white`), na żółtej/neutralnej — `text-surface-foreground`.

### 1b. Kolory statusowe (badge'y dokumentacji)

| Klasa | Token | HEX (dark) | Rola |
|---|---|---|---|
| `success` | `--status-success` | `#16A34A` | Sukces, metoda POST, odpowiedź 200/201 — `green/600` |
| `info` | `--status-info` | `#2563EB` | Metoda GET, informacja — `blue/600` |
| `warning` | `--status-warning` | `#D97706` | Ostrzeżenie — `amber/600` |
| `error` | `--status-error` | `#DC2626` | Błąd, etykieta „wymagane" — `red/600` (odrębny od `destructive`, który jest ciemny pod guziki) |
| `tool` | `--status-tool` | `#9333EA` | Badge `tool` MCP, nazwa parametru — `purple/600` |

> Aliasy raw→semantic (light=Tailwind 400, dark=600), round-trip do Figmy wykonany (kolekcja `semantic colors` → `status/*`, 2026-06-12). Wzorzec użycia badge'a: jeden token z modyfikatorami alpha — `bg-success/15 text-success border-success/30` (NIE trzy surowe kolory). ✅ Wdrożone w `app/docs/page.tsx`.

---

## 2. Radius

| Klasa | px | Zastosowanie |
|---|---|---|
| `rounded-lg` | **8** | **OBOWIĄZKOWE dla przycisków i pól** (`<button>`, `<input>`, `<textarea>`). Zakaz innych. |
| `rounded-xl` | 12 | Dialog / popover (`bg-popover`) |
| `rounded-2xl` | 16 | Pola formularza-bloki (textarea, TagInput, MoodSelector), DateBlock |
| `rounded-3xl` | 24 | Karty wpisów (EntryCard), modale |
| `rounded-full` | 9999 | Pigułki: tagi, BottomNav, FAB, awatary |

- **Token bazowy `radius` = 10px** (`--radius: 0.625rem`) — korzeń skali shadcn, z którego liczone są `--radius-sm/md/xl…`. To NIE jest domyślny radius guzika (guzik ma twarde `rounded-lg` = 8px).
- **Świadoma decyzja:** reguła „tylko `rounded-lg`" z `CLAUDE.md` dotyczy **wyłącznie przycisków i pól**. Karty, dialogi i pigułki używają większych zaokrągleń — to celowe, nie błąd.

---

## 3. Spacing

Skala potwierdzona w Figmie (kolekcja `spacing`, skala t-shirt) — **zgodna co do piksela z Tailwindem**, więc używaj zwykłych klas Tailwind (`p-4`, `gap-6`, `mt-8`).

| Token Figma | px | Tailwind |
|---|---|---|
| `xs` | 8 | `2` (p-2/gap-2) |
| `sm` | 12 | `3` |
| `md` | 16 | `4` |
| `lg` | 20 | `5` |
| `xl` | 24 | `6` |
| `2xl` | 32 | `8` |
| `3xl` | 40 | `10` |
| `4xl` | 48 | `12` |
| `5xl` | 64 | `16` |

> Realne stałe w widokach: padding strony `px-6 md:px-8`, odstępy sekcji `gap-4`/`gap-6`, rytm pionowy `mb-8`/`mb-10`.

---

## 4. Typografia

Wartości pobrane na żywo z Figmy (kolekcja `typography`, `get_variable_defs`). **Rodzina = Poppins** (font-family body i heading w Figmie).

| Rola | Token Figma | font-size / line-height | weight | letter-spacing |
|---|---|---|---|---|
| Heading 1 | `heading 1` | 48 / 48 | 600 Semibold | −1.5 |
| Heading 2 | `heading 2` | 30 / 30 | 600 Semibold | −1 |
| Heading 3 | `heading 3` | 24 / 28.8 | 600 | −1 |
| Heading 4 | `heading 4` | 20 / 24 | 600 | 0 |
| Paragraph regular | `paragraph/regular` | 16 / 24 | 400 | 0 |
| Paragraph small | `paragraph/small` | 14 / 20 | 400 / 500 | 0 |
| Paragraph mini | `paragraph/mini` | 12 / 16 | 400 / 500 | 0 |

### Mapowanie na klasy Tailwind (jak realizuje to kod)

Kod **nie** binduje tokenów `heading 1–4` — stosuje klasy Tailwind, które odpowiadają tej skali:

| Rola w UI | Klasa | Uwaga vs Figma |
|---|---|---|
| Tytuł strony (h1) | `text-4xl md:text-5xl font-black` | mobile 36px, desktop 48px = `heading 1` |
| Tytuł karty (h2) | `text-xl font-bold` | 20px = `heading 4` |
| Treść / body | `text-base` | 16px = `paragraph/regular` ✓ |
| Pomocniczy / meta | `text-sm text-muted` | 14px = `paragraph/small` ✓ |
| Caption / tag | `text-xs` | 12px = `paragraph/mini` ✓ |

### Rodziny fontów — REGUŁA: tylko Poppins

**Stosujemy wyłącznie Poppins** — body i wszystkie nagłówki. Geist (domyślny font shadcn) **wyrzucamy**, mimo że to default kitu. Zgodne z Figmą (font-family body i headings = Poppins).

- **Poppins** (`--font-poppins-var`, wagi 400/500/600/700/900) — body i nagłówki.
- `--font-heading` i `--font-sans` wskazują na Poppins. `DialogTitle` (`font-heading`) → Poppins.
- ✅ **Wdrożone (2026-06-11):** `Geist` usunięty z `app/layout.tsx`; `--font-heading`/`--font-sans` w `@theme` (`globals.css`) przepięte na `var(--font-poppins-var)`. Zweryfikowane w przeglądarce: `body` i `h1` renderują Poppins.

---

## 5. Jak dodać token (rozszerzalność)

Kontrakt to żywa lista. Dodanie tokenu:

1. **Zacznij od Figmy** — token musi istnieć w Obra kit (`search_design_system` / `get_variable_defs`). Nie wymyślaj nazw.
2. Dodaj zmienną trybową w `app/globals.css` (`:root` + `.dark`) i zmapuj w bloku `@theme inline` na `--color-*`.
3. Dopisz wiersz do właściwej tabeli powyżej: klasa, token CSS, HEX (dark), rola.
4. Jeśli to nowy kolor brandowy/akcent — rozważ round-trip do Figmy (jak `journal/*`).
