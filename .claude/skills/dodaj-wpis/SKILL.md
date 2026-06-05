---
name: dodaj-wpis
description: Dodaj nowy wpis do dziennika Dzienniczek. Użyj tego skilla gdy użytkownik mówi "dodaj wpis", "zapisz w dzienniku", "nowy wpis", "chcę napisać do dziennika", "stwórz wpis" lub "dodaj mi wpis do mojego dzienniczka" — lub cokolwiek sugerującego chęć dodania wpisu do swojego osobistego dziennika. Przeprowadź konwersacyjny wywiad i zapisz wpis do Supabase.
---

# Skill: Dodaj wpis do Dzienniczka

Przeprowadź konwersacyjny wywiad krok po kroku, a następnie zapisz wpis do Supabase.

## Dane konfiguracyjne

- **user_id**: `db333613-d10f-4515-9a89-3428fcdbc0c6`
- **Plik .env.local**: `/Users/katarzynasmolen/Library/CloudStorage/GoogleDrive-katarzynasmolen1@gmail.com/Mój dysk/Nueve kurs - dzienniczek/.env.local`

## Wywiad — jedno pytanie na raz

Zadaj każde pytanie osobno i poczekaj na odpowiedź.

**Pytanie 1 — Tytuł:**
> "📝 Jaki tytuł ma mieć wpis? (wpisz tytuł lub 'skip' — wtedy wymyślę go sam)"

**Pytanie 2 — Treść:**
> "✍️ Co chcesz zapisać?"

**Pytanie 3 — Nastrój:**
> "😊 Jaki masz nastrój? Wpisz: great / good / neutral / bad / terrible (lub 'skip')"

Jeśli użytkownik wpisze inną wartość, dopasuj ją do najbliższej. Skip = null.

**Pytanie 4 — Tagi:**
> "🏷️ Tagi? (np. praca, rodzina — lub 'skip')"

Rozbij po przecinkach. Skip = `[]`.

## Podsumowanie przed zapisem

Pokaż podsumowanie i zapytaj "Zapisać? (tak / nie)".

## Zapis do Supabase

Po potwierdzeniu wykonaj przez Bash:

```bash
set -a && source "/Users/katarzynasmolen/Library/CloudStorage/GoogleDrive-katarzynasmolen1@gmail.com/Mój dysk/Nueve kurs - dzienniczek/.env.local" && set +a && python3 -c "
import subprocess, json, os

url = os.environ['NEXT_PUBLIC_SUPABASE_URL']
key = os.environ['SUPABASE_SERVICE_ROLE_KEY']

data = {
    'user_id': 'db333613-d10f-4515-9a89-3428fcdbc0c6',
    'title': '''TYTUŁ''',
    'content': '''TREŚĆ''',
    'tags': TAGI
}
MOOD

result = subprocess.run([
    'curl', '-s', '-X', 'POST',
    url + '/rest/v1/entries',
    '-H', 'apikey: ' + key,
    '-H', 'Authorization: Bearer ' + key,
    '-H', 'Content-Type: application/json',
    '-H', 'Prefer: return=representation',
    '-d', json.dumps(data)
], capture_output=True, text=True)

try:
    response = json.loads(result.stdout)
    if isinstance(response, list) and response:
        print('✅ Wpis zapisany! ID: ' + response[0]['id'])
    else:
        print('❌ Błąd: ' + result.stdout)
except Exception as e:
    print('❌ Błąd: ' + str(e))
"
```

Podstaw przed wykonaniem:
- `TYTUŁ` → tytuł (jeśli skip: pierwsze 60 znaków treści)
- `TREŚĆ` → treść użytkownika
- `TAGI` → lista Python np. `['praca', 'rodzina']` lub `[]`
- `MOOD` → jeśli podany: `data['mood'] = 'good'`; jeśli skip: pomiń linię

Po zapisie poinformuj że wpis jest widoczny w aplikacji.
