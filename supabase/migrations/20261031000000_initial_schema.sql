-- WitScribe's Supabase schema. Run this once in the Supabase SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text not null default '',
  phone text not null default '',
  location text not null default '',
  postal_code text not null default '',
  photo_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null default '',
  author_avatar text,
  title text not null check (char_length(title) between 1 and 180),
  description text not null default '' check (char_length(description) <= 10000),
  like_count integer not null default 0 check (like_count >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.question_likes (
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (question_id, user_id)
);

create table if not exists public.question_comments (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null default '',
  text text not null check (char_length(text) between 1 and 5000),
  created_at timestamptz not null default now()
);

create index if not exists questions_created_at_idx on public.questions (created_at desc);
create index if not exists questions_like_count_idx on public.questions (like_count desc);
create index if not exists question_comments_question_created_idx on public.question_comments (question_id, created_at);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name, phone, photo_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_witscribe on auth.users;
create trigger on_auth_user_created_witscribe
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

create or replace function public.set_community_author()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  profile_name text;
  profile_avatar text;
begin
  select display_name, photo_url into profile_name, profile_avatar
  from public.profiles
  where id = auth.uid();

  new.author_id := auth.uid();
  new.author_name := coalesce(
    nullif(profile_name, ''),
    auth.jwt() -> 'user_metadata' ->> 'display_name',
    auth.jwt() -> 'user_metadata' ->> 'full_name',
    auth.jwt() ->> 'email',
    'WitScribe member'
  );
  if tg_table_name = 'questions' then
    new.author_avatar := coalesce(nullif(profile_avatar, ''), auth.jwt() -> 'user_metadata' ->> 'avatar_url', '');
  end if;
  return new;
end;
$$;

drop trigger if exists set_question_author on public.questions;
create trigger set_question_author before insert on public.questions
  for each row execute function public.set_community_author();
drop trigger if exists set_comment_author on public.question_comments;
create trigger set_comment_author before insert on public.question_comments
  for each row execute function public.set_community_author();

create or replace function public.refresh_question_like_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_question_id uuid;
begin
  target_question_id := coalesce(new.question_id, old.question_id);
  update public.questions
  set like_count = (select count(*)::integer from public.question_likes where question_id = target_question_id)
  where id = target_question_id;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists refresh_question_like_count on public.question_likes;
create trigger refresh_question_like_count
  after insert or delete on public.question_likes
  for each row execute function public.refresh_question_like_count();

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.question_likes enable row level security;
alter table public.question_comments enable row level security;

grant select on public.questions, public.question_likes, public.question_comments to anon, authenticated;
grant insert, delete on public.questions to authenticated;
grant insert, delete on public.question_likes to authenticated;
grant insert, delete on public.question_comments to authenticated;
grant select, update on public.profiles to authenticated;

drop policy if exists "Questions are public" on public.questions;
create policy "Questions are public" on public.questions for select using (true);
drop policy if exists "Signed-in users can create questions" on public.questions;
create policy "Signed-in users can create questions" on public.questions for insert to authenticated
  with check (author_id = (select auth.uid()));
drop policy if exists "Authors can delete questions" on public.questions;
create policy "Authors can delete questions" on public.questions for delete to authenticated
  using (author_id = (select auth.uid()));

drop policy if exists "Likes are public" on public.question_likes;
create policy "Likes are public" on public.question_likes for select using (true);
drop policy if exists "Users can like as themselves" on public.question_likes;
create policy "Users can like as themselves" on public.question_likes for insert to authenticated
  with check (user_id = (select auth.uid()));
drop policy if exists "Users can remove their own likes" on public.question_likes;
create policy "Users can remove their own likes" on public.question_likes for delete to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Comments are public" on public.question_comments;
create policy "Comments are public" on public.question_comments for select using (true);
drop policy if exists "Signed-in users can comment as themselves" on public.question_comments;
create policy "Signed-in users can comment as themselves" on public.question_comments for insert to authenticated
  with check (author_id = (select auth.uid()));
drop policy if exists "Authors can delete their comments" on public.question_comments;
create policy "Authors can delete their comments" on public.question_comments for delete to authenticated
  using (author_id = (select auth.uid()));

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles for select to authenticated
  using (id = (select auth.uid()));
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "Avatar images are public" on storage.objects;
create policy "Avatar images are public" on storage.objects for select
  using (bucket_id = 'avatars');
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'questions') then
    alter publication supabase_realtime add table public.questions;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'question_likes') then
    alter publication supabase_realtime add table public.question_likes;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'question_comments') then
    alter publication supabase_realtime add table public.question_comments;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles') then
    alter publication supabase_realtime add table public.profiles;
  end if;
end;
$$;
