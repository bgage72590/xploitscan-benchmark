// pg (node-postgres) with string concatenation — the pattern AI coding
// tools generate when asked to "filter by id". No parameter binding,
// trivially exploitable. VC006 must fire.

import { Pool } from "pg";
const pool = new Pool();

export async function getUserById(userId) {
  // String-concatenated SQL — attacker controls userId.
  const { rows } = await pool.query(
    "SELECT id, email, role FROM users WHERE id = " + userId
  );
  return rows[0];
}
