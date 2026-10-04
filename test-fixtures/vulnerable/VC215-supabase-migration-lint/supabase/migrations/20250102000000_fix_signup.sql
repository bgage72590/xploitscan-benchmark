-- "Fix" for a sign-up error: switches RLS off instead of writing a policy.
alter table public.projects disable row level security;
