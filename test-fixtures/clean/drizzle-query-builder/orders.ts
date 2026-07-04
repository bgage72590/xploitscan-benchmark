// Drizzle's query builder — no raw SQL, no string interpolation. All
// values pass through Drizzle's binding layer before hitting the driver.
// The sql`` tagged template (distinct from sql.raw) is ALSO safe.
// VC006 must not fire.

import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and, sql } from "drizzle-orm";
import { orders } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

export async function findOrder(orderId: number, userId: number) {
  // Query builder form — eq() and and() emit bound parameters.
  return db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .limit(1);
}

export async function ordersAboveAmount(min: number) {
  // Tagged template form — ${min} becomes a bound parameter, not
  // concatenated. sql.raw(...) is the unsafe form; sql`` is safe.
  return db.select().from(orders).where(sql`${orders.amount} > ${min}`);
}
