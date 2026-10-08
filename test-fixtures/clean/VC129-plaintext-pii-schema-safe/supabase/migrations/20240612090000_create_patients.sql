-- Patients intake table for the clinic portal.
-- The SSN is encrypted in the app with a KMS-wrapped data key before insert;
-- only the ciphertext and the last four digits (for display) are stored.
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  full_name text not null,
  date_of_birth date not null,
  encrypted_ssn text not null,
  ssn_last4 char(4) not null,
  insurance_member_id text,
  created_at timestamptz not null default now()
);

-- Cards are tokenized by Stripe; we never see or store the PAN.
create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  stripe_payment_method_id text not null,
  card_brand text,
  card_last4 char(4),
  created_at timestamptz not null default now()
);

alter table public.patients enable row level security;
alter table public.payment_methods enable row level security;

create policy "clinic staff read patients" on public.patients
  for select using (clinic_id in (select clinic_id from public.staff where user_id = auth.uid()));
