-- Baseline: reguły RLS dla danych użytkownika + funkcja wyszukiwania.
-- Ten stan jest JUŻ obecny w bazie projektu Dzienniczek — plik zrzuca go do repo,
-- żeby reguły bezpieczeństwa były wersjonowane (prośba z code review).
-- SQL jest idempotentny: można uruchomić ponownie bez błędu.

-- ===== entries (wpisy dziennika) =====
alter table public.entries enable row level security;

drop policy if exists "Users can view own entries" on public.entries;
create policy "Users can view own entries" on public.entries
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own entries" on public.entries;
create policy "Users can insert own entries" on public.entries
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own entries" on public.entries;
create policy "Users can update own entries" on public.entries
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own entries" on public.entries;
create policy "Users can delete own entries" on public.entries
  for delete using (auth.uid() = user_id);

-- ===== conversations (rozmowy z Freudem) =====
alter table public.conversations enable row level security;

drop policy if exists "Users can manage own conversations" on public.conversations;
create policy "Users can manage own conversations" on public.conversations
  for all using (auth.uid() = user_id);

-- ===== messages (wiadomości w rozmowach) =====
alter table public.messages enable row level security;

drop policy if exists "Users can manage messages in own conversations" on public.messages;
create policy "Users can manage messages in own conversations" on public.messages
  for all using (
    conversation_id in (
      select id from public.conversations where user_id = auth.uid()
    )
  );

-- ===== funkcja hybrydowego wyszukiwania wpisów (pgvector + full-text, fuzja RRF) =====
CREATE OR REPLACE FUNCTION public.hybrid_search_entries(p_user_id uuid, p_query_embedding vector, p_query_text text, p_limit integer DEFAULT 15)
 RETURNS TABLE(id uuid, title text, content text, mood text, tags text[], created_at timestamp with time zone, rrf_score double precision)
 LANGUAGE sql
 STABLE
AS $function$
  WITH vector_results AS (
    SELECT e.id,
           ROW_NUMBER() OVER (ORDER BY e.embedding <=> p_query_embedding) AS rank
    FROM entries e
    WHERE e.user_id = p_user_id AND e.embedding IS NOT NULL
    ORDER BY e.embedding <=> p_query_embedding
    LIMIT 50
  ),
  fts_results AS (
    SELECT e.id,
           ROW_NUMBER() OVER (
             ORDER BY ts_rank(
               to_tsvector('simple', coalesce(e.title,'') || ' ' || coalesce(e.content,'')),
               plainto_tsquery('simple', p_query_text)
             ) DESC
           ) AS rank
    FROM entries e
    WHERE e.user_id = p_user_id
      AND to_tsvector('simple', coalesce(e.title,'') || ' ' || coalesce(e.content,''))
          @@ plainto_tsquery('simple', p_query_text)
    LIMIT 50
  ),
  combined AS (
    SELECT
      COALESCE(vr.id, fr.id) AS id,
      COALESCE(1.0 / (60 + vr.rank), 0.0) + COALESCE(1.0 / (60 + fr.rank), 0.0) AS rrf_score
    FROM vector_results vr
    FULL OUTER JOIN fts_results fr ON vr.id = fr.id
  )
  SELECT e.id, e.title, e.content, e.mood::text, e.tags, e.created_at, c.rrf_score
  FROM combined c
  JOIN entries e ON e.id = c.id
  ORDER BY c.rrf_score DESC
  LIMIT p_limit;
$function$;
