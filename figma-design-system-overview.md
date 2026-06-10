# Design System — Struktura zmiennych Figma
**Plik:** Obra shadcn/ui kit community edition (1.6.0)  
**Źródło:** Figma MCP + eksporty tokenów (Mode 1, shadcn, shadcn-dark, shadcn-darkcharts)  
**Data:** 2026-06-09

---

## Mapa kolekcji

```
┌─────────────────────────────────────────────────────────────────┐
│  WARSTWA 1 — PRYMITYWY (absolutne wartości)                     │
│                                                                 │
│  raw colors (244)        brand colors (28)                      │
│  border radii (absolute) (10)   spacing (absolute) (37)         │
│  alpha (34)                                                     │
└────────────────────────────┬────────────────────────────────────┘
                             │ aliasy (light / dark modes)
┌────────────────────────────▼────────────────────────────────────┐
│  WARSTWA 2 — SEMANTYKA (tryby light/dark, role UI)              │
│                                                                 │
│  semantic colors (54)    border radii (10)                      │
│  spacing (27)            shadows (51)                           │
│  chart colors (11)       typography (58)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ CSS variables
┌────────────────────────────▼────────────────────────────────────┐
│  WARSTWA 3 — KOMPONENTY shadcn/ui                               │
│  var(--background)  var(--radius)  var(--chart-1) ...           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Jak działa Dark Mode

Dark mode **nie jest osobną kolekcją** — to drugi **tryb (mode)** wewnątrz każdej kolekcji semantycznej. Każdy token ma wartość `light` i `dark`.

W kodzie: shadcn/ui generuje CSS variables w `:root {}` (light) i `.dark {}` (dark). Przełączanie = dodanie klasy `.dark` na `<html>`.

**Ważne:** Dark mode używa kolekcji **brand colors** (`brand-neutrals/*`), nie Tailwind zinc. Tokeny interaktywne (ghost, outline, input) w dark mode sięgają do **alpha** (white/alpha-*).

---

## 1. Brand Colors — brand-neutrals (skala neutralna)

Własna skala projektu — używana przez semantic colors jako prymitywy w trybie dark. Wartości identyczne z Tailwind `neutral`.

| Token | Hex | Użycie w dark mode |
|---|---|---|
| `brand-neutrals/50` | `#FAFAFA` | foreground, sidebar primary |
| `brand-neutrals/100` | `#F5F5F5` | primary, accent foreground, secondary foreground |
| `brand-neutrals/200` | `#E5E5E5` | ghost foreground |
| `brand-neutrals/300` | `#D4D4D4` | foreground alt, sidebar foreground, primary hover |
| `brand-neutrals/400` | `#A3A3A3` | muted foreground, mid alt |
| `brand-neutrals/500` | `#737373` | sidebar muted |
| `brand-neutrals/600` | `#525252` | border 4 |
| `brand-neutrals/700` | `#404040` | border, ring, accent 3, border 3 |
| `brand-neutrals/800` | `#262626` | secondary, sidebar border, accent 2 |
| `brand-neutrals/900` | `#171717` | card, muted, accent, sidebar accent, secondary hover |
| `brand-neutrals/950` | `#0A0A0A` | background, primary foreground, body background |

---

## 2. Raw Colors (244 tokenów)

Pełna paleta Tailwind CSS v3 — prymitywy light mode i kolory destructive.

| Skala | 50 | 500 | 950 |
|---|---|---|---|
| `white` | `#FFFFFF` | — | — |
| `black` | `#000000` | — | — |
| `neutral` | `#FAFAFA` | `#737373` | `#0A0A0A` |
| `slate` | `#F8FAFC` | `#64748B` | `#020617` |
| `gray` | `#F9FAFB` | `#6B7280` | `#030712` |
| `zinc` | `#FAFAFA` | `#71717A` | `#09090B` |
| `stone` | `#FAFAF9` | `#78716C` | `#0C0A09` |
| `red` | `#FEF2F2` | `#EF4444` | `#450A0A` |
| `orange` | `#FFF7ED` | `#F97316` | `#431407` |
| `amber` | `#FFFBEB` | `#F59E0B` | `#451A03` |
| `yellow` | `#FEFCE8` | `#EAB308` | `#422006` |
| `lime` | `#F7FEE7` | `#84CC16` | `#1A2E05` |
| `green` | `#F0FDF4` | `#22C55E` | `#052E16` |
| `emerald` | `#ECFDF5` | `#10B981` | `#022C22` |
| `teal` | `#F0FDFA` | `#14B8A6` | `#042F2E` |
| `cyan` | `#ECFEFF` | `#06B6D4` | `#083344` |
| `sky` | `#F0F9FF` | `#0EA5E9` | `#082F49` |
| `blue` | `#EFF6FF` | `#3B82F6` | `#172554` |
| `indigo` | `#EEF2FF` | `#6366F1` | `#1E1B4B` |
| `violet` | `#F5F3FF` | `#8B5CF6` | `#2E1065` |
| `purple` | `#FAF5FF` | `#A855F7` | `#3B0764` |
| `fuchsia` | `#FDF4FF` | `#D946EF` | `#4A044E` |
| `pink` | `#FDF2F8` | `#EC4899` | `#500724` |
| `rose` | `#FFF1F2` | `#F43F5E` | `#4C0519` |

> Każda skala: 11 kroków — 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

---

## 3. Alpha (34 tokenów)

Kolory white i black z poziomami przezroczystości. W dark mode: tokeny interaktywne (ghost, outline, input) używają white/alpha-*.

| White alpha | | Black alpha | |
|---|---|---|---|
| `white/alpha-0` | 0% | `black/alpha-0` | 0% |
| `white/alpha-5` | 5% | `black/alpha-5` | 5% |
| `white/alpha-10` | 10% | `black/alpha-50` | 50% |
| `white/alpha-15` | 15% | `black/alpha-60` | 60% |
| `white/alpha-20` | 20% | `black/alpha-70` | 70% |
| `white/alpha-30` | 30% | `white/alpha-001` | ~0% |
| `white/alpha-40` | 40% | `white/alpha-100` | 100% |
| `white/alpha-70` | 70% | `black/alpha-100` | 100% |
| `white/alpha-80` | 80% | | |
| `white/alpha-95` | 95% | | |

---

## 4. Border Radii (absolute) (10 tokenów) → prymitywy

| Token | px |
|---|---|
| `radius-2` | 2px |
| `radius-4` | 4px |
| `radius-6` | 6px |
| `radius-8` | 8px |
| `radius-10` | 10px |
| `radius-12` | 12px |
| `radius-16` | 16px |
| `radius-24` | 24px |
| `radius-32` | 32px |
| `radius-infinite` | 9999px |

---

## 5. Border Radii (10 tokenów) → semantyczne

Tryb `shadcn`. Każdy token jest aliasem do prymitywu.

| Token semantyczny | → Prymityw | px |
|---|---|---|
| `rounded-none` | *(bezpośrednie 0)* | 0px |
| `rounded-xs` | `radius-2` | 2px |
| `rounded-sm` | `radius-4` | 4px |
| `rounded-md` | `radius-6` | 6px |
| `rounded-lg` | `radius-8` | 8px |
| **`radius`** ⭐ | **`radius-10`** | **10px** |
| `rounded-xl` | `radius-12` | 12px |
| `rounded-2xl` | `radius-16` | 16px |
| `rounded-3xl` | `radius-24` | 24px |
| `rounded-full` | `radius-infinite` | 9999px |

> ⭐ `radius` = główny token konfiguracyjny (`--radius`). Domyślnie **10px**. Zmiana go przebudowuje zaokrąglenia wszystkich komponentów.

---

## 6. Spacing (absolute) (37 tokenów) → prymitywy

Wzór: `nazwa × 4 = px`. Wszystkie ukryte przed publishingiem.

| Nazwa | px | | Nazwa | px | | Nazwa | px |
|---|---|---|---|---|---|---|---|
| `0` | 0 | | `5` | 20 | | `28` | 112 |
| `0,5` | 2 | | `6` | 24 | | `32` | 128 |
| `0,75` | 3 | | `7` | 28 | | `36` | 144 |
| `1` | 4 | | `8` | 32 | | `40` | 160 |
| `1,25` | 5 | | `9` | 36 | | `44` | 176 |
| `1,5` | 6 | | `10` | 40 | | `48` | 192 |
| `2` | 8 | | `11` | 44 | | `52` | 208 |
| `2,5` | 10 | | `12` | 48 | | `56` | 224 |
| `3` | 12 | | `14` | 56 | | `60` | 240 |
| `3,5` | 14 | | `16` | 64 | | `64` | 256 |
| `4` | 16 | | `20` | 80 | | `72` | 288 |
| | | | `24` | 96 | | `80` | 320 |
| | | | | | | `96` | 384 |
| | | | | | | `infinite` | 9999 |

---

## 7. Spacing (27 tokenów) → semantyczne

### Skala t-shirt (16 tokenów)

| Token | → Absolute | px |
|---|---|---|
| `3xs` | `0,5` | 2px |
| `2xs` | `1` | 4px |
| `xs` | `2` | 8px |
| `sm` | `3` | 12px |
| `md` | `4` | 16px |
| `lg` | `5` | 20px |
| `xl` | `6` | 24px |
| `2xl` | `8` | 32px |
| `3xl` | `10` | 40px |
| `4xl` | `12` | 48px |
| `5xl` | `16` | 64px |
| `6xl` | `20` | 80px |
| `7xl` | `24` | 96px |
| `8xl` | `28` | 112px |
| `9xl` | `32` | 128px |
| `10xl` | `36` | 144px |

### Hacks to fit scale (11 tokenów)

Wartości bezpośrednie dla rozmiarów niezgodnych ze skalą ×4 — używane w precyzyjnych paddingach komponentów.

`3px` `5.5px` `6px` `7px` `7.5px` `8.5px` `9px` `9.5px` `10px` `14px` `15.5px`

---

## 8. Semantic Colors (54 tokenów) — light & dark

Komponenty używają **wyłącznie** tych tokenów przez CSS variables.

### General (14 tokenów)

| Token | CSS var | Light | Dark | Dark ref |
|---|---|---|---|---|
| `background` | `--background` | — | `#0A0A0A` | brand-neutrals/950 |
| `foreground` | `--foreground` | — | `#FAFAFA` | brand-neutrals/50 |
| `primary` | `--primary` | — | `#F5F5F5` | brand-neutrals/100 |
| `primary foreground` | `--primary-foreground` | — | `#0A0A0A` | brand-neutrals/950 |
| `secondary` | `--secondary` | — | `#262626` | brand-neutrals/800 |
| `secondary foreground` | `--secondary-foreground` | — | `#F5F5F5` | brand-neutrals/100 |
| `destructive` | `--destructive` | — | `#9E4042` | — |
| `destructive foreground` | `--destructive-foreground` | — | `#FFFFFF` | white/alpha-100 |
| `muted` | `--muted` | — | `#171717` | brand-neutrals/900 |
| `muted foreground` | `--muted-foreground` | — | `#A3A3A3` | brand-neutrals/400 |
| `accent` | `--accent` | — | `#171717` | brand-neutrals/900 |
| `accent foreground` | `--accent-foreground` | — | `#F5F5F5` | brand-neutrals/100 |
| `border` | `--border` | — | `#404040` | brand-neutrals/700 |
| `input` | `--input` | — | `rgba(#FFF, 5%)` | white/alpha-5 |

### Card (2 tokeny)

| Token | CSS var | Dark | Dark ref |
|---|---|---|---|
| `card/card` | `--card` | `#171717` | brand-neutrals/900 |
| `card/card foreground` | `--card-foreground` | `#FFFFFF` | white/alpha-100 |

### Popover (2 tokeny)

| Token | CSS var | Dark | Dark ref |
|---|---|---|---|
| `popover/popover` | `--popover` | `#FFFFFF` | white/alpha-100 |
| `popover/popover foreground` | `--popover-foreground` | `#000000` | black/alpha-100 |

### Focus (2 tokeny)

| Token | Rola | Dark | Dark ref |
|---|---|---|---|
| `focus/ring` | `--ring` — focus ring | `#404040` | brand-neutrals/700 |
| `focus/ring error` | Focus ring przy błędzie | `#6D2E2F` | — |

### Sidebar (9 tokenów)

Osobna warstwa — sidebar może mieć inny motyw niż reszta UI.

| Token | CSS var | Dark | Dark ref |
|---|---|---|---|
| `sidebar/sidebar` | `--sidebar-background` | `#0A0A0A` | brand-neutrals/950 |
| `sidebar/sidebar foreground` | `--sidebar-foreground` | `#D4D4D4` | brand-neutrals/300 |
| `sidebar/sidebar primary` | `--sidebar-primary` | `#FAFAFA` | brand-neutrals/50 |
| `sidebar/sidebar primary foreground` | `--sidebar-primary-foreground` | `#171717` | brand-neutrals/900 |
| `sidebar/sidebar accent` | `--sidebar-accent` | `#171717` | brand-neutrals/900 |
| `sidebar/sidebar accent foreground` | `--sidebar-accent-foreground` | `#F5F5F5` | brand-neutrals/100 |
| `sidebar/sidebar border` | `--sidebar-border` | `#262626` | brand-neutrals/800 |
| `sidebar/sidebar ring` | `--sidebar-ring` | `#404040` | brand-neutrals/700 |
| `sidebar/unofficial/sidebar muted` | — | `#737373` | brand-neutrals/500 |

### Unofficial — rozszerzenia Obra (25 tokenów)

Tokeny spoza oficjalnej spec shadcn/ui — pełne stany interakcji i gradacje tonalne.

| Token | Rola | Dark | Dark ref |
|---|---|---|---|
| `foreground alt` | Tekst body (niższy kontrast) | `#D4D4D4` | brand-neutrals/300 |
| `body background` | Tło body strony | `#0A0A0A` | brand-neutrals/950 |
| `ghost` | Tło ghost btn (normalny) | `rgba(#FFF, ~0%)` | white/alpha-001 |
| `ghost hover` | Tło ghost btn (hover) | `rgba(#FFF, 10%)` | white/alpha-10 |
| `ghost foreground` | Tekst ghost btn | `#E5E5E5` | brand-neutrals/200 |
| `primary hover` | Tło primary btn (hover) | `#D4D4D4` | brand-neutrals/300 |
| `secondary hover` | Tło secondary btn (hover) | `#171717` | brand-neutrals/900 |
| `outline` | Tło outline btn (normalny) | `rgba(#FFF, 5%)` | white/alpha-5 |
| `outline hover` | Tło outline btn (hover) | `rgba(#FFF, 10%)` | white/alpha-10 |
| `outline active` | Tło outline btn (pressed) | `rgba(#FFF, 15%)` | white/alpha-15 |
| `backdrop` | Overlay/modal backdrop | `rgba(#000, 60%)` | black/alpha-60 |
| `mid alt` | Środkowy ton tła | `#A3A3A3` | brand-neutrals/400 |
| `accent 0` | Akcent Level 0 (najjaśniejszy) | `#0A0A0A` | brand-neutrals/950 |
| `accent 2` | Akcent Level 2 | `#262626` | brand-neutrals/800 |
| `accent 3` | Akcent Level 3 | `#404040` | brand-neutrals/700 |
| `border 0` | Border subtelny | `#0A0A0A` | brand-neutrals/950 |
| `border 1` | Border separator | `#171717` | brand-neutrals/900 |
| `border 3` | Border wyraźny | `#404040` | brand-neutrals/700 |
| `border 4` | Border mocny | `#525252` | brand-neutrals/600 |
| `border 5` | Border najciemniejszy | `#737373` | brand-neutrals/500 |
| `destructive text` | Tekst błędu inline | `#F87171` | raw colors/red/400 |
| `destructive border` | Border pola z błędem | `#EF4444` | raw colors/red/500 |
| `destructive subtle` | Tło sekcji błędu | `#450A0A` | raw colors/red/950 |

> Light mode values dla semantic colors: wyeksportuj tryb `shadcn-light` z Figma.

---

## 9. Chart Colors (11 tokenów) — light & dark

### Categorical (5) — `--chart-1` … `--chart-5`

Paleta do wykresów wieloseriowych (słupkowe, liniowe, kołowe).

| Token | CSS var | Dark hex |
|---|---|---|
| `categorical/chart 1` | `--chart-1` | `#1447E6` — niebieski |
| `categorical/chart 2` | `--chart-2` | `#00BC7D` — zielony |
| `categorical/chart 3` | `--chart-3` | `#FD9A00` — pomarańczowy |
| `categorical/chart 4` | `--chart-4` | `#AD46FF` — fioletowy |
| `categorical/chart 5` | `--chart-5` | `#FF2056` — czerwony |

### Sentiment (2) — do wykresów kierunkowych

| Token | Dark hex | Znaczenie |
|---|---|---|
| `sentiment/positive` | `#00BC7D` | Wzrost, zysk, sukces (= chart 2) |
| `sentiment/negative` | `#FF2056` | Spadek, strata, błąd (= chart 5) |

### Shades (4) — wypełnienia i obrysy

Do area chartów i gradientów. `fill` ma alpha 0.7.

| Token | Dark hex | Alpha | Rola |
|---|---|---|---|
| `shades/fill` | `#475D75` | 0.7 | Półprzezroczyste tło obszaru |
| `shades/stroke` | `#8EC5FF` | 1 | Obrys linii wykresu |
| `shades/fill 2` | `#1F4176` | 0.7 | Alternatywne tło (ciemniejsze) |
| `shades/stroke 2` | `#3F8DFF` | 1 | Alternatywny obrys |

---

## 10. Shadows (51 tokenów)

7 rozmiarów. Każdy = token koloru + tokeny float (x, y, blur, spread). Gotowe style efektów:

`shadow-2xs` `shadow-xs` `shadow-sm` `shadow-md` `shadow-lg` `shadow-xl` `shadow-2xl`

---

## 11. Kolekcje niezamapowane

| Kolekcja | Tokeny | Brakuje |
|---|---|---|
| **typography** | 58 | Eksport z Figma |
| **chart colors light** | 11 | Eksport trybu `shadcn-light` |
| **semantic colors light** | 54 | Eksport trybu `shadcn-light` |

---

## Mapa zależności

```
raw colors (hex)  ──────────────────► semantic colors / light mode
                                              │
brand colors (brand-neutrals)  ──────────────► semantic colors / dark mode
                                              │
alpha (rgba white/black) ────────────────────► semantic colors / dark mode
         (interactive tokens)                 │
                                              ▼
                                    CSS variables (:root + .dark)
                                              │
                                              ▼
                                    komponenty shadcn/ui

border radii (absolute) ─────────────────────► border radii (semantic aliasy)
                                              │
                                              ▼
                                    var(--radius) i klasy rounded-*

spacing (absolute) ──────────────────────────► spacing (semantic t-shirt scale)
                                              │
                                              ▼
                                    padding / margin / gap komponentów

shadows (float + color tokens) ──────────────► style efektów shadow-2xs…shadow-2xl
```

---

## Klucze Figma

| Kolekcja | variableSetKey |
|---|---|
| semantic colors | `eacfdf7c0d67bea6a22c0dd0a4a1ed62a5a9d137` |
| border radii (semantic) | `124622548bf591543dda4674f6d9cee7515d2775` |
| shadows | `1be43d028c2e18eaca1678dbd7204f6133104a55` |
| chart colors | `f2d15e9a20ed8009181d09530336ab0bdb250946` |
| alpha | `23952f53e232a821ee206c0f7d463b1dc6ec3dcb` |
| spacing (absolute) | `8003041d11b733e75a048aba2a081f3669e1d608` |
