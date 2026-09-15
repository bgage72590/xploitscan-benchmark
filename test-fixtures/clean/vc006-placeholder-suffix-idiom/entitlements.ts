// A variable-length IN (...) clause has no bound form of its own, so the run
// of markers is built up front from a fixed list and every value still
// travels through args[]. None of the data reaches the SQL text.

const ENTITLED_STATUSES = ["active", "trialing", "past_due"];
const ENTITLED_STATUSES_PLACEHOLDERS = ENTITLED_STATUSES.map(() => "?").join(", ");

export async function entitledSubscription(orgId: string) {
  const result = await db.execute({
    sql: `SELECT plan, status FROM subscriptions WHERE org_id = ? AND status IN (${ENTITLED_STATUSES_PLACEHOLDERS}) ORDER BY created_at DESC`,
    args: [orgId, ...ENTITLED_STATUSES],
  });
  return result.rows[0];
}

declare const db: { execute: (q: { sql: string; args: unknown[] }) => Promise<{ rows: unknown[] }> };
