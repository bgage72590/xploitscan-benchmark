// Postgres pool for the Supabase database. Credentials are read from the
// environment; the URL is assembled at runtime, nothing secret is in source.

import { Pool } from "pg";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ??
    `postgresql://${DB_USER}:${encodeURIComponent(DB_PASSWORD ?? "")}@${DB_HOST}:6543/${DB_NAME}`,
  max: 10,
  idleTimeoutMillis: 30_000,
});

export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const { rows } = await pool.query(text, params);
  return rows as T[];
}
