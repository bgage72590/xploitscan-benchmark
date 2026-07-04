// Knex's .raw() with string concatenation — the opposite of the safe
// parameterized form (knex.raw(sql, [binding])). VC006 must fire.

import knex from "./db.js";

export async function ordersByStatus(status) {
  // Concat inside knex.raw — bypasses Knex's binding system entirely.
  const result = await knex.raw(
    "SELECT * FROM orders WHERE status = '" + status + "' ORDER BY created_at DESC"
  );
  return result.rows;
}
