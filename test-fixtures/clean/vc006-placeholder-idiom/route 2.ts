// The standard SQL IN-clause idiom: generate "?,?,?" placeholder string,
// interpolate it into the SQL template, and pass the actual values via
// args[]. This is fully parameterized — the interpolation is of
// PLACEHOLDER MARKERS (literal `?` chars), not user data.

export async function GET(request: Request, { params }: { params: { teamId: string } }) {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 100);
  const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10), 0);

  const memberUserIds = ["user_a", "user_b", "user_c"]; // would come from DB
  const placeholders = memberUserIds.map(() => "?").join(", ");

  const scansResult = await db.execute({
    sql: `SELECT * FROM scans WHERE user_id IN (${placeholders}) ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    args: [...memberUserIds, limit, offset],
  });

  return Response.json({ scans: scansResult.rows });
}

declare const db: { execute: (q: { sql: string; args: unknown[] }) => Promise<{ rows: unknown[] }> };
