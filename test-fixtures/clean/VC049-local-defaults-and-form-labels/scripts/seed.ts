// Seeds the local Supabase database started by `supabase start`. The fallback
// URL is the Supabase CLI's fixed local default (postgres:postgres on port
// 54322, as printed by `supabase status`); it only ever points at this machine.
import postgres from "postgres";

const sql = postgres(
  process.env.SEED_DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
);

await sql`
  insert into plans (id, name, monthly_price_cents)
  values ('free', 'Free', 0), ('pro', 'Pro', 1900)
  on conflict (id) do nothing
`;
await sql.end();
