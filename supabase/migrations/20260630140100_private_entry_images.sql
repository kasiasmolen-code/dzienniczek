-- Prywatne zdjęcia wpisów (naprawa #3 z code review).
-- Wcześniej bucket `entry-images` był publiczny + polityka publicznego odczytu,
-- więc każdy z linkiem widział cudze zdjęcia. Teraz: bucket prywatny, a dostęp
-- tylko do własnych plików — aplikacja wyświetla zdjęcia przez signed URL.

-- 1) Bucket prywatny (koniec publicznych, wiecznych linków)
update storage.buckets set public = false where id = 'entry-images';

-- 2) Usuń publiczny odczyt całego bucketa
drop policy if exists "Public read for entry images" on storage.objects;

-- 3) Odczyt tylko własnych plików (potrzebny do generowania signed URL)
drop policy if exists "Users can view their own images" on storage.objects;
create policy "Users can view their own images" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'entry-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

-- 4) Upload własnych plików (odtworzenie istniejącej reguły, idempotentnie)
drop policy if exists "Users can upload their own images" on storage.objects;
create policy "Users can upload their own images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'entry-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

-- 5) Usuwanie własnych plików (odtworzenie istniejącej reguły, idempotentnie)
drop policy if exists "Users can delete their own images" on storage.objects;
create policy "Users can delete their own images" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'entry-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );
