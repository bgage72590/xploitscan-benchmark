// The same idiom under a camelCase name. The marker run is built from the
// caller's list; the ids themselves are bound and never reach the SQL text.

export async function scansForMembers(memberIds: string[], since: string) {
  const memberPlaceholders = memberIds.map(() => "?").join(", ");
  const result = await db.execute({
    sql: `SELECT user_id, score FROM scans WHERE user_id IN (${memberPlaceholders}) AND created_at >= ?`,
    args: [...memberIds, since],
  });
  return result.rows;
}

declare const db: { execute: (q: { sql: string; args: unknown[] }) => Promise<{ rows: unknown[] }> };
