// Postgres pool for the Supabase database, used by the API routes.
// The connection string copied from the Supabase dashboard still contains
// the database password.

import { Pool } from "pg";

export const pool = new Pool({
  connectionString: "postgresql://postgres.abcdefghijklmnop:Tq8!mZr42vLs@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
  max: 10,
  idleTimeoutMillis: 30_000,
});

export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const { rows } = await pool.query(text, params);
  return rows as T[];
}
