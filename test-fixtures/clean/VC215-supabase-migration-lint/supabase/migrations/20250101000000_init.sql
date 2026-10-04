-- The safe shapes VC215 must stay quiet on.

create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  title text not null
);
alter table public.todos enable row level security;

-- Owner-scoped writes.
create policy "own todos" on public.todos
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Public READ is out of scope: catalogues and profiles are often public on purpose.
create policy "anyone can read todos" on public.todos for select using (true);

-- Scoped to roles that bypass RLS or that the anon key cannot become: no-ops.
create policy "service role all" on public.todos for all to service_role using (true) with check (true);
create policy "auth admin read" on public.todos for all to supabase_auth_admin using (true);

-- A restrictive always-true policy restricts nothing and opens nothing.
create policy "restrictive noop" on public.todos as restrictive for all using (true);

-- Admin-only updates: USING decides who, so WITH CHECK (true) opens nothing more.
create policy "admins edit" on public.todos for update using (public.is_admin()) with check (true);

-- Role kept in app_metadata, which only the service role can set.
create policy "admins delete" on public.todos
  for delete using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- A temporary open policy the same migration removes again.
create policy "temp backfill" on public.todos for all using (true);
update public.todos set title = trim(title);
drop policy "temp backfill" on public.todos;

-- Disable → backfill → enable inside one migration.
alter table public.todos disable row level security;
update public.todos set title = lower(title);
alter table public.todos enable row level security;

-- A table that is never exposed: RLS off, privileges revoked from both browser roles.
create table public.job_queue (id bigserial primary key, payload jsonb);
alter table public.job_queue disable row level security;
revoke all on table public.job_queue from anon, authenticated;

-- Internal schema, not served by the Data API.
create schema if not exists private;
create table private.audit (id bigserial primary key, note text);
alter table private.audit disable row level security;

-- A trigger function: raw_user_meta_data copied into profiles, and RLS DDL in
-- a function body. Neither is a policy and neither runs at migration time.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.todos (user_id, title) values (new.id, new.raw_user_meta_data ->> 'name');
  -- alter table public.todos disable row level security;
  execute 'alter table public.todos disable row level security';
  return new;
end;
$$;

-- An open insert the team reviewed and accepted.
create table public.waitlist (email text primary key);
alter table public.waitlist enable row level security;
-- VC215-OK: waitlist sign-up is anonymous by design; insert-only, no reads.
create policy "join waitlist" on public.waitlist for insert with check (true);

/* Documentation, not DDL:
   create policy "open" on public.todos for all using (true);
   alter table public.todos disable row level security; */

-- Permissive role grant, narrowed to the owner by a restrictive policy on the
-- same table: Postgres ANDs restrictive policies in, so this is owner-only.
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  body text
);
alter table public.documents enable row level security;
create policy "members can use documents" on public.documents
  as permissive for all to authenticated
  using (true) with check (true);
create policy "only the owner" on public.documents
  as restrictive for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
