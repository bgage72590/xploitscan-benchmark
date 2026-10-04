-- Schema for a Lovable-style project tracker. The browser talks to Supabase
-- directly with the anon key, so these policies are the only access control.

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id),
  name text not null
);

create table public.waitlist (
  email text primary key
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  amount_cents int not null
);

alter table public.projects enable row level security;
alter table public.waitlist enable row level security;
alter table public.invoices enable row level security;

-- Named for the service role, but there is no TO clause: it applies to PUBLIC,
-- which includes anon. Anyone with the anon key can read and rewrite every row.
create policy "Service role full access" on public.projects
  for all
  using (true)
  with check (true);

-- Any account can change or delete anyone's project.
create policy "admins all" on public.projects for all to authenticated using (true) with check (true);

-- Open insert: anyone can add rows with any values.
create policy "Anyone can join the waitlist" on public.waitlist
  for insert
  with check (true);

-- user_metadata is writable by the user via supabase.auth.updateUser().
create policy "Org members read invoices" on public.invoices
  for select to authenticated
  using (org_id = (auth.jwt() -> 'user_metadata' ->> 'org_id')::uuid);
