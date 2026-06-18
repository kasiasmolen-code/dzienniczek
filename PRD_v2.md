# Dzienniczek — Product Requirements Document

> **Nazwa produktu:** Dzienniczek
> **Język produktu:** polski
>
> **Pitch (jedno zdanie):** Dzienniczek to osobisty dziennik emocji, który nie tylko
> przechowuje Twoje wpisy, ale pomaga je zrozumieć — dzięki wbudowanemu, empatycznemu
> asystentowi AI, który pamięta Twoją historię i dostrzega wzorce nastroju.

---

## 1. Wizja produktu i problem

### Problem
Klasyczne aplikacje do prowadzenia dziennika są pasywnymi „pojemnikami na tekst". Użytkownik
zapisuje swoje myśli, ale:
- rzadko do nich wraca i jeszcze rzadziej dostrzega **wzorce** (np. „w poniedziałki nastrój
  zawsze spada"),
- zapis wymaga wysiłku — pisanie na telefonie zniechęca do regularności,
- brakuje **rozmowy** — momentu, w którym ktoś (lub coś) pomoże nazwać emocję i zadać dobre
  pytanie.

### Wizja
Tworzymy dziennik, który jest **aktywnym towarzyszem refleksji**. Użytkownik szybko zapisuje
wpis (również głosem), oznacza nastrój — a w każdej chwili może porozmawiać z asystentem AI
o imieniu **Freud**, który zna całą jego historię wpisów, nawiązuje do konkretnych zdarzeń
i pomaga zrozumieć emocje. Produkt ma być **kameralny, spokojny i prywatny** — bezpieczna
przestrzeń do prowadzenia dziennika emocji po polsku.

### Czym Dzienniczek NIE jest
- Nie jest narzędziem medycznym ani terapią — Freud wspiera refleksję, **nie stawia diagnoz**.
- Nie jest social appem — brak feedu, znajomych, polubień. Dziennik jest prywatny.

---

## 2. Cele i metryki sukcesu

Cele jakościowe (MVP nie wymaga twardych liczb):

| Cel | Jak rozpoznamy sukces |
|---|---|
| **Niski próg zapisu** | Dodanie wpisu (w tym głosem) zajmuje kilkanaście sekund; użytkownik wraca regularnie. |
| **Wartość z rozmowy** | Użytkownik korzysta z Freuda więcej niż raz; rozmowy nawiązują do realnych wpisów. |
| **Zrozumienie emocji** | Użytkownik dostrzega wzorce nastroju, do których sam by nie dotarł. |
| **Poczucie bezpieczeństwa** | Użytkownik ufa, że jego dziennik jest prywatny i odizolowany. |

---

## 3. Persony / grupa docelowa

### Segment podstawowy — osoba prowadząca dziennik emocji

**Zadanie do wykonania (job-to-be-done):** regularnie zapisywać myśli i samopoczucie po polsku,
a z czasem **rozumieć** własne emocje i wzorce nastroju.

**Cele:**
- Zapisać myśl lub zdarzenie w momencie, gdy się pojawia — bez tarcia i ceremonii.
- Oznaczać nastrój, żeby później dostrzec, co i kiedy na niego wpływa.
- Wracać do wpisów i otrzymać pomoc w nazwaniu oraz zrozumieniu tego, co czuje.

**Bolączki (pain points):**
- Pisanie długiego tekstu na telefonie zniechęca — przez to porzuca prowadzenie dziennika.
- Samodzielnie nie dostrzega wzorców („dlaczego znów spadek nastroju?") — dane leżą bezużyteczne.
- Przeładowane, „korporacyjne" lub jaskrawe interfejsy podnoszą napięcie zamiast je obniżać.
- Obawa o prywatność: dziennik to dane wrażliwe, których nie chce nikomu udostępniać.

**Model mentalny:** traktuje aplikację jak prywatny, cichy notes — a nie jak sieć społecznościową
ani narzędzie produktywności. Oczekuje, że „to po prostu zapamięta" i że nikt poza nim tego nie
zobaczy.

**Oczekiwania wobec produktu:** błyskawiczny zapis (również **głosem**), spokojny i minimalistyczny
interfejs, możliwość **rozmowy o swoich wpisach** z asystentem, który zna jego historię, oraz
pełna prywatność i izolacja danych.

### Segment zaawansowany — użytkownik integrujący dziennik z własnymi narzędziami

**Zadanie do wykonania:** operować na swoich danych z dziennika spoza interfejsu aplikacji —
automatyzować, podłączać do własnych asystentów AI, budować integracje.

**Cele:**
- Tworzyć, pobierać i przeszukiwać wpisy oraz rozmowy programatycznie.
- Podłączyć dziennik do zewnętrznego asystenta AI i operować na nim przez narzędzia.

**Bolączki (pain points):**
- Aplikacje-„silosy" bez API zamykają dane i uniemożliwiają własne przepływy pracy.
- Niejasna lub niekompletna dokumentacja API blokuje integrację.
- Brak standardowego sposobu połączenia danych z asystentem AI wymusza obejścia.

**Model mentalny:** myśli w kategoriach **endpointów, tokenów i narzędzi** — oczekuje, że
wszystko, co da się zrobić w UI, da się też zrobić programatycznie.

**Oczekiwania wobec produktu:** REST API z czytelną specyfikacją **OpenAPI** i dokumentacją oraz
serwer **MCP** umożliwiający podłączenie dziennika do asystenta AI.

---

## 4. Historyjki użytkownika i przypadki użycia

### 4.1 Historyjki użytkownika (User Stories)

**EPIK 1 — Konto i logowanie**
- **US-1.1** Jako użytkownik chcę **założyć konto i się zalogować**, aby moje wpisy były prywatne
  i dostępne tylko dla mnie.
- **US-1.2** Jako zalogowany użytkownik chcę móc się **wylogować**, aby zabezpieczyć dziennik na
  współdzielonym urządzeniu.

**EPIK 2 — Tworzenie i edycja wpisu**
- **US-2.1** Jako użytkownik chcę **utworzyć nowy wpis** z tytułem i treścią, aby zapisać myśl
  lub zdarzenie.
- **US-2.2** Jako użytkownik chcę **określić nastrój** wpisu na prostej skali, aby później
  śledzić emocje.
- **US-2.3** Jako użytkownik chcę **dodać tagi**, aby grupować wpisy tematycznie.
- **US-2.4** Jako użytkownik chcę **dołączyć zdjęcie**, aby wzbogacić wpis kontekstem wizualnym.
- **US-2.5** Jako użytkownik chcę, aby moje zmiany **zapisywały się automatycznie**, abym nie
  tracił treści.
- **US-2.6** Jako użytkownik chcę **edytować lub usunąć** istniejący wpis (z potwierdzeniem usunięcia).

**EPIK 3 — Szybki zapis głosem**
- **US-3.1** Jako użytkownik chcę **podyktować treść wpisu głosem**, aby zapisać myśl bez pisania
  na klawiaturze.
- **US-3.2** Jako użytkownik chcę, aby nagranie zostało **przepisane na tekst po polsku** i dopisane
  do treści.
- **US-3.3** Jako użytkownik chcę **wizualnej informacji** o tym, że trwa nagrywanie i przetwarzanie.

**EPIK 4 — Przeglądanie i podgląd wpisów**
- **US-4.1** Jako użytkownik chcę zobaczyć **listę moich wpisów** (z nastrojem i datą), aby szybko
  się zorientować w historii.
- **US-4.2** Jako użytkownik chcę **otworzyć pojedynczy wpis**, aby zobaczyć jego pełną treść,
  zdjęcie i tagi.
- **US-4.3** Jako użytkownik chcę widzieć **stan pusty** z zachętą, gdy nie mam jeszcze żadnych wpisów.

**EPIK 5 — Rozmowa z Freudem (asystent AI)**
- **US-5.1** Jako użytkownik chcę **rozpocząć rozmowę z Freudem**, aby porozmawiać o swoim
  samopoczuciu.
- **US-5.2** Jako użytkownik chcę, aby Freud **znał moją historię wpisów** i nawiązywał do
  konkretnych z nich.
- **US-5.3** Jako użytkownik chcę, aby Freud **odnajdywał najbardziej trafne wpisy** powiązane
  z moim pytaniem, nawet jeśli nie pamiętam dokładnej daty (wyszukiwanie po znaczeniu, nie po słowie).
- **US-5.4** Jako użytkownik chcę móc rozmawiać o **konkretnym, otwartym wpisie**, aby pogłębić
  refleksję nad nim.
- **US-5.5** Jako użytkownik chcę mieć **historię rozmów** (lista, tytuły, usuwanie), aby wracać
  do wcześniejszych wątków.
- **US-5.6** Jako użytkownik chcę widzieć **odpowiedź pojawiającą się na żywo** (strumieniowo),
  aby rozmowa była naturalna.

**EPIK 6 — Dostęp programatyczny (zaawansowani)**
- **US-6.1** Jako techniczny użytkownik chcę mieć **REST API** z dokumentacją (OpenAPI), aby
  zarządzać wpisami i rozmowami programatycznie.
- **US-6.2** Jako techniczny użytkownik chcę **serwera MCP**, aby podłączyć swój dziennik do
  zewnętrznego asystenta AI i operować na wpisach oraz rozmowach przez narzędzia.

### 4.2 Przypadki użycia (Use Cases) — kluczowe ścieżki

**UC-1: Dodanie wpisu głosem** *(US-2.1, US-2.2, US-3.1–3.3, US-2.5)*
1. Użytkownik na liście wpisów klika „Nowy wpis".
2. Wpisuje tytuł, opcjonalnie wybiera nastrój.
3. Klika ikonę mikrofonu → interfejs przechodzi w stan *nagrywanie* (animacja fal).
4. Mówi swoją myśl, klika stop → stan *przetwarzanie*.
5. Transkrybowany po polsku tekst **dopisuje się** do treści wpisu.
6. Użytkownik poprawia tekst, dodaje tagi; zmiany zapisują się automatycznie.
7. Wraca na listę — nowy wpis jest widoczny na górze.

**UC-2: Rozmowa z Freudem o konkretnym wpisie** *(US-4.2, US-5.1, US-5.2, US-5.4, US-5.6)*
1. Użytkownik otwiera wpis i wybiera „Porozmawiaj z Freudem".
2. System tworzy rozmowę powiązaną z tym wpisem (`entry_id`).
3. Freud wita się ciepło, nawiązując do treści otwartego wpisu, i zadaje jedno otwarte pytanie.
4. Użytkownik odpowiada; odpowiedź Freuda pojawia się strumieniowo.
5. Rozmowa zapisuje się; jej tytuł powstaje automatycznie z pierwszej wiadomości.

**UC-3: Refleksja oparta na historii (wyszukiwanie semantyczne)** *(US-5.1, US-5.3, US-5.6)*
1. Użytkownik otwiera Freuda i pyta np. „Dlaczego ostatnio czuję się przytłoczony?".
2. System liczy embedding pytania i wykonuje **hybrydowe wyszukiwanie** po wpisach.
3. Najtrafniejsze wpisy trafiają do kontekstu modelu.
4. Freud odpowiada, **nawiązując do konkretnych wpisów** i dostrzegając wzorzec nastroju.
5. Jeśli wyszukiwanie/embedding zawiedzie, rozmowa działa dalej na skrócie ostatnich wpisów.

**UC-4: Edycja i usunięcie wpisu** *(US-2.6)*
1. Użytkownik otwiera wpis → „Edytuj", zmienia treść/nastrój/tagi/zdjęcie → „Zapisz".
2. Albo wybiera „Usuń" → pojawia się modal potwierdzenia.
3. Po potwierdzeniu wpis (wraz z ewentualnym zdjęciem) zostaje usunięty; użytkownik wraca na listę.

**UC-5: Dostęp przez MCP z zewnętrznego asystenta** *(US-6.1, US-6.2)*
1. Zaawansowany użytkownik konfiguruje asystenta AI z serwerem MCP Dzienniczka (token uwierzytelniający).
2. Asystent wywołuje narzędzie `list_entries` / `create_entry`, operując na danych użytkownika.
3. Asystent może rozpocząć rozmowę z Freudem (`create_conversation`, `send_message`) i pobrać odpowiedź.

---

## 5. Wymagania funkcjonalne

### 5.1 Wpisy
- Wpis MUSI mieć: **tytuł** (wymagany do zapisu) i **treść**.
- Wpis MUSI obsługiwać **nastrój** w pięciostopniowej skali: *świetny, dobry, neutralny, zły,
  bardzo zły*. Nastrój jest opcjonalny.
- Wpis MUSI obsługiwać **tagi** (lista, maksymalnie **10**).
- Wpis MOŻE mieć **jedno zdjęcie**; limit rozmiaru POWINIEN wynosić ~10 MB, tylko pliki obrazów.
- Formularz wpisu POWINIEN wspierać **autozapis** (debounce), aby nie tracić treści.
- Użytkownik MUSI móc **edytować** i **usuwać** wpisy; usunięcie MUSI być potwierdzane.
- Każdy wpis MUSI być **przypisany do właściciela** i niewidoczny dla innych.

### 5.2 Zapis głosowy
- Aplikacja MUSI umożliwiać **nagranie głosu** w przeglądarce i jego **transkrypcję na język
  polski**.
- Transkrybowany tekst MUSI być **dopisywany** do treści wpisu (a nie nadpisywać jej).
- Interfejs MUSI sygnalizować stany: *nagrywanie*, *przetwarzanie*, *błąd*.
- Awaria transkrypcji NIE MOŻE blokować ręcznego zapisu wpisu.

### 5.3 Freud (asystent AI)
- Freud MUSI odpowiadać **wyłącznie po polsku**, ciepło, zwięźle (domyślnie 3–4 zdania),
  bez żargonu.
- Freud MUSI mieć w kontekście **skrót ostatnich wpisów** użytkownika oraz — jeśli dotyczy —
  **aktualnie otwarty wpis**.
- System MUSI realizować **wyszukiwanie semantyczne (hybrydowe)** po wpisach, aby do kontekstu
  rozmowy trafiały najtrafniejsze wpisy względem pytania.
- Freud MUSI **odmawiać stawiania diagnoz** i — w razie sygnałów o myślach samobójczych lub
  samookaleczeniu — **delikatnie kierować do profesjonalnej pomocy**.
- Rozmowy MUSZĄ być **zapisywane** (wiadomości użytkownika i asystenta), z **automatycznym
  tytułem** na podstawie pierwszej wiadomości.
- Odpowiedzi POWINNY być **strumieniowane** do interfejsu.

### 5.4 Historia rozmów
- Użytkownik MUSI widzieć **listę rozmów** z tytułem i datą, móc je **wybierać**, **tworzyć
  nowe** i **usuwać**.

### 5.5 API i MCP
- Produkt MUSI udostępniać **REST API** dla wpisów i rozmów, z **uwierzytelnianiem** i
  **specyfikacją OpenAPI** oraz stroną dokumentacji w aplikacji.
- Produkt MUSI udostępniać **serwer MCP po HTTP** z narzędziami obejmującymi co najmniej:
  tworzenie/listowanie/pobieranie wpisu oraz tworzenie/listowanie rozmów i wysyłanie/pobieranie
  wiadomości.

### 5.6 Uwierzytelnianie
- Aplikacja MUSI wymagać logowania; niezalogowany użytkownik MUSI być przekierowany do ekranu
  logowania.

---

## 6. Zakres funkcjonalny — ekran po ekranie

### 6.1 Logowanie (`/login`)
- **Cel:** uwierzytelnienie użytkownika (logowanie / rejestracja).
- **Zawartość:** pola e-mail i hasło, przełączenie logowanie ↔ rejestracja, komunikaty błędów.
- **Akcje:** zaloguj, zarejestruj.
- **Przejścia:** po sukcesie → lista wpisów (`/`). Niezalogowany użytkownik wchodzący na dowolny
  ekran jest tu przekierowywany.

### 6.2 Lista wpisów / Home (`/`)
- **Cel:** szybki przegląd historii i punkt startu do wszystkich akcji.
- **Zawartość:** tytuł „Dzienniczek" + licznik wpisów; siatka kart wpisów (tytuł, fragment treści,
  nastrój, data, miniatura zdjęcia); stan pusty z zachętą.
- **Layout:** mobile — jedna/dwie kolumny + dolna nawigacja; desktop — lewy panel boczny
  (nazwa, „Nowy wpis", Home, API Docs, Wyloguj) + siatka kart.
- **Akcje:** nowy wpis, otwórz wpis, wyloguj, przejście do Docs.
- **Przejścia:** „Nowy wpis" → `/new`; klik karty → `/[id]`.

### 6.3 Nowy wpis (`/new`)
- **Cel:** utworzenie wpisu z możliwie najmniejszym tarciem.
- **Zawartość:** pole tytułu, selektor nastroju (5 stanów, odznaczalny), pole treści z przyciskami
  **mikrofonu** (dyktowanie) i **zdjęcia** (upload), wskaźniki stanu nagrywania/transkrypcji,
  podgląd zdjęcia z możliwością usunięcia, pole tagów.
- **Akcje:** zapis (ręczny i/lub autozapis), dyktowanie głosowe, dodanie/usunięcie zdjęcia,
  dodawanie tagów, Wstecz.
- **Przejścia:** po zapisie → lista wpisów lub podgląd wpisu.

### 6.4 Podgląd wpisu (`/[id]`)
- **Cel:** przeczytanie pełnego wpisu i podjęcie akcji.
- **Zawartość:** tytuł, data, nastrój, pełna treść, zdjęcie, tagi.
- **Akcje:** edytuj, usuń (z potwierdzeniem), porozmawiaj o wpisie z Freudem, Wstecz.
- **Przejścia:** „Edytuj" → `/[id]/edit`; „Freud" → `/freud?conv=…` z kontekstem tego wpisu;
  po usunięciu → lista wpisów.

### 6.5 Edycja wpisu (`/[id]/edit`)
- **Cel:** zmiana istniejącego wpisu.
- **Zawartość:** ten sam formularz co „Nowy wpis", wypełniony danymi wpisu.
- **Akcje:** zapis zmian, Wstecz/anuluj.
- **Przejścia:** po zapisie → podgląd wpisu.

### 6.6 Freud — czat z asystentem (`/freud`)
- **Cel:** rozmowa z asystentem terapeutycznym znającym historię wpisów.
- **Zawartość:** panel/lista historii rozmów (tytuł, data, usuwanie), okno czatu ze
  strumieniowanymi odpowiedziami, stan pusty „Cześć, jestem Freud".
- **Layout:** mobile — czat pełnoekranowy + szuflada historii; desktop — lewy panel rozmów + czat.
- **Akcje:** nowa rozmowa, wybór rozmowy, usunięcie rozmowy, wysłanie wiadomości, Wstecz.
- **Przejścia:** wejście z podglądu wpisu (`?conv=`) otwiera rozmowę powiązaną z wpisem.

### 6.7 Dokumentacja API (`/docs`)
- **Cel:** udostępnić zaawansowanym użytkownikom opis REST API i MCP.
- **Zawartość:** opis endpointów na bazie specyfikacji OpenAPI, sekcja MCP.
- **Akcje:** przeglądanie, kopiowanie przykładów.

### 6.8 Elementy wspólne
- **Dolna nawigacja (mobile)** i **panel boczny (desktop)** jako stała nawigacja.
- **Pływający przycisk Freuda** dostępny z poziomu wpisów.
- **Modal potwierdzenia** dla akcji destrukcyjnych (usunięcie wpisu/rozmowy).

---

## 7. Model danych

### 7.1 Encje

**`Entry` — wpis dziennika**

| Pole | Typ | Uwagi |
|---|---|---|
| `id` | UUID | klucz główny |
| `user_id` | UUID | właściciel (FK → użytkownik) |
| `title` | string | maks. 200 znaków |
| `content` | string | wymagane, maks. 50 000 znaków |
| `mood` | `Mood \| null` | jeden z: `great, good, neutral, bad, terrible` |
| `tags` | string[] | maks. 10 tagów, każdy ≤ 50 znaków |
| `image_url` | string \| null | URL zdjęcia w storage (opcjonalne) |
| `embedding` | vector | wektor do wyszukiwania semantycznego (pgvector) |
| `created_at` / `updated_at` | timestamp | znaczniki czasu |

**`Conversation` — rozmowa z Freudem**

| Pole | Typ | Uwagi |
|---|---|---|
| `id` | UUID | klucz główny |
| `user_id` | UUID | właściciel |
| `title` | string \| null | auto-generowany z 1. wiadomości |
| `entry_id` | UUID \| null | opcjonalne powiązanie z wpisem |
| `created_at` / `updated_at` | timestamp | sort po `updated_at` |

**`Message` — wiadomość w rozmowie**

| Pole | Typ | Uwagi |
|---|---|---|
| `id` | UUID | klucz główny |
| `conversation_id` | UUID | FK → `Conversation` |
| `role` | `'user' \| 'assistant'` | autor wiadomości |
| `content` | string | maks. 10 000 znaków |
| `created_at` | timestamp | sort rosnąco |

### 7.2 Typy i słowniki
- **`Mood`** (kolejność w UI od najgorszego do najlepszego): `terrible, bad, neutral, good, great`
  → etykiety PL: *bardzo zły, zły, neutralny, dobry, świetny*.

### 7.3 Relacje
- Użytkownik **1 — N** `Entry`.
- Użytkownik **1 — N** `Conversation`; `Conversation` **0/1 — 1** `Entry` (opcjonalne `entry_id`).
- `Conversation` **1 — N** `Message`.

### 7.4 Zasady integralności i dostępu
- Wszystkie zapytania MUSZĄ być ograniczone do `user_id` zalogowanego użytkownika (izolacja danych).
- Usunięcie wpisu POWINNO usuwać powiązane zdjęcie ze storage.
- Usunięcie rozmowy MUSI usuwać jej wiadomości.
- Embedding wpisu jest liczony asynchronicznie po zapisie i NIE MOŻE blokować utworzenia wpisu.

---

## 8. Wymagania niefunkcjonalne

- **Prywatność i bezpieczeństwo:** dziennik zawiera dane wrażliwe. Dane MUSZĄ być
  **odizolowane per użytkownik**; nikt poza właścicielem nie ma dostępu do jego wpisów i rozmów.
- **Język:** całość interfejsu i treści AI po polsku.
- **Responsywność:** każdy ekran MUSI mieć dopracowany układ **mobilny** i **desktopowy**
  (na desktopie m.in. układ z panelem bocznym).
- **Dostępność (a11y):** czytelne kontrasty, obsługa klawiatury, sensowne etykiety; komponenty
  POWINNY być weryfikowane pod kątem a11y.
- **Wydajność i odporność:** odpowiedzi AI strumieniowane; awarie usług zewnętrznych
  (transkrypcja, wyszukiwanie semantyczne) MUSZĄ degradować się łagodnie, bez blokowania
  podstawowych funkcji.

---

## 9. Wymagania designu i stylu

### Charakter wizualny
- **Tylko tryb ciemny (dark mode).** Aplikacja nie posiada trybu jasnego — interfejs jest
  zaprojektowany jako dark-only.
- Styl **nowoczesny, minimalistyczny i spokojny** — dużo przestrzeni, brak wizualnego szumu,
  stonowana paleta sprzyjająca refleksji.
- Mocne, wyraziste nagłówki (np. nazwa aplikacji) jako akcent; reszta interfejsu utrzymana
  cicho i czytelnie.

### Design system i tokeny
- **Źródłem prawdy dla designu jest Figma.** Wszystkie kolory, odstępy, cienie i zaokrąglenia
  MUSZĄ pochodzić z **tokenów semantycznych** (np. `bg-background`, `text-foreground`,
  `bg-muted`, `text-muted-foreground`).
- **Zakaz surowych kolorów** (HEX, domyślne szarości frameworka). Kolory zawsze mapowane na
  tokeny.
- **Typografia:** jeden krój — **Poppins**.
- **Ikony:** wyłącznie zestaw outline (Heroicons). Bez mieszania bibliotek ikon i bez emoji
  w roli ikon akcji.
- **Komponenty:** budowane na bazie spójnej biblioteki (shadcn/ui), dokumentowane w Storybooku.

### Reguły komponentów
- **Zaokrąglenia:** przyciski oraz pola formularzy (`input`, `textarea`) MUSZĄ używać `rounded-lg`
  (8px). Inne klasy zaokrągleń dla tych elementów są zabronione.
- **Standard przycisków akcji:**

  | Akcja | Wariant | Rozmiar | Ikona |
  |---|---|---|---|
  | Główna / primary | `default` | `default` | — |
  | Drugorzędna | `secondary` | `lg` | — |
  | Destrukcyjna (usuń, reset) | `destructive` | `lg` | — |
  | Nawigacja wstecz | `ghost` | `default` | `ChevronLeftIcon` (outline) + tekst „Wstecz" |

- **Nawigacja wstecz** MUSI być zawsze realizowana jako `ghost` z ikoną `ChevronLeftIcon`
  i tekstem „Wstecz" — bez surowych przycisków, strzałek `←` ani innych ikon.

### Layout
- Każdy widok MUSI mieć **dedykowane układy mobile i desktop** (osobne kompozycje, nie tylko
  skalowanie). Na desktopie wzorcem jest układ z bocznym panelem (lista wpisów / historia rozmów),
  na mobile — układ jednokolumnowy z dolną nawigacją i ekranami pełnoekranowymi.

---

## 10. Zakres MVP i poza zakresem

**W zakresie MVP**
- Konto, logowanie, wylogowanie.
- Pełny CRUD wpisów: tytuł, treść, nastrój, tagi, zdjęcie, autozapis.
- Zapis głosowy z transkrypcją PL.
- Freud: rozmowa ze znajomością historii wpisów + wyszukiwanie semantyczne + historia rozmów.
- REST API + OpenAPI + serwer MCP.
- Dark-only design system, responsywność mobile + desktop.

**Poza zakresem MVP (rozważyć później)**
- Tryb jasny / przełącznik motywu (świadomie pomijany — produkt jest dark-only).
- Społecznościowość, współdzielenie wpisów.
- Zaawansowane analizy/wykresy nastroju w czasie.
- Powiadomienia push, przypomnienia o wpisach.
- Eksport danych, wersje offline.

---

## 11. Założenia techniczne (wysokopoziomowe)

- **Aplikacja webowa** w nowoczesnym frameworku React (Next.js / App Router), responsywna.
- **Backend-as-a-service** do uwierzytelniania, bazy danych i przechowywania plików (Supabase).
- **Wyszukiwanie semantyczne** oparte o embeddingi i wektorową bazę (pgvector) — wpisy
  indeksowane embeddingami, wyszukiwanie hybrydowe (semantyczne + tekstowe).
- **Asystent AI (Freud)** zasilany modelem Anthropic (Claude), z odpowiedziami strumieniowanymi.
- **Transkrypcja głosu** przez usługę zewnętrzną (model klasy Whisper, język polski).
- **Ekspozycja programatyczna** przez REST (OpenAPI) oraz serwer **MCP** po HTTP.
- **Design** utrzymany w spójności z Figmą (round-trip kod ↔ design), tokeny jako kontrakt.

---

## 12. Otwarte pytania i ryzyka

- **Bezpieczeństwo emocjonalne:** jak dopracować reakcje Freuda na sygnały kryzysowe? Jakie
  zasoby pomocy (np. numery wsparcia) wskazywać?
- **Prywatność danych wrażliwych:** zakres szyfrowania, retencja, prawo do usunięcia danych.
- **Koszty AI:** modele językowe, embeddingi i transkrypcja generują koszty zależne od użycia —
  potrzebne limity / monitorowanie.
- **Jakość wyszukiwania semantycznego:** czy hybryda (semantyka + tekst) wystarczy dla krótkich,
  emocjonalnych wpisów?
- **Granica „asystent vs. terapia":** jak komunikować użytkownikowi, że Freud nie zastępuje
  specjalisty.
