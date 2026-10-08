-- Patients intake table for the clinic portal
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  full_name text not null,
  date_of_birth date not null,
  ssn text not null,
  insurance_member_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  cardholder_name text not null,
  card_number varchar(19) not null,
  expiry varchar(5) not null,
  created_at timestamptz not null default now()
);

alter table public.patients enable row level security;
alter table public.payment_methods enable row level security;

create policy "clinic staff read patients" on public.patients
  for select using (clinic_id in (select clinic_id from public.staff where user_id = auth.uid()));
