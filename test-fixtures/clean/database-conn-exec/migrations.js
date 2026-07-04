// better-sqlite3 database migrations using conn.exec() — NOT child_process.exec().
// Scanner previously flagged ALTER TABLE statements as shell command injection.
// VC094 must NOT fire.

import Database from "better-sqlite3";

const conn = new Database("data/store.sqlite");

export function addColumnIfMissing(table, column, type) {
  const cols = conn
    .prepare(`PRAGMA table_info(${table})`)
    .all();
  if (cols.some((c) => c.name === column)) return;
  conn.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
}

export function runMigrations() {
  conn.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
}
