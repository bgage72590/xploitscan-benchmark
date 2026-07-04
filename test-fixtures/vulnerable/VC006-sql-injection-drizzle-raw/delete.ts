// Drizzle ORM's sql.raw() escape hatch — concatenates the string as-is
// with no parameter binding. Used when someone needs a dynamic SQL
// fragment and forgets (or doesn't know) about the sql`` tagged template
// form that IS safe. VC006 must fire.

import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export async function cleanupUser(userId) {
  // sql.raw() bypasses Drizzle's parameter binding — direct string interpolation.
  await db.execute(sql.raw(`DELETE FROM users WHERE id = ${userId}`));
}
