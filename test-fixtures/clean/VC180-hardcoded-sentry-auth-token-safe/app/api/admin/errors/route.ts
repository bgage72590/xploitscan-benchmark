import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

// Internal dashboard widget: unresolved Sentry issues from the last 24h.
const SENTRY_API = "https://sentry.io/api/0/projects/acme-labs/web/issues/";

export async function GET(req: Request) {
  await requireAdmin(req);

  const token = process.env.SENTRY_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Sentry is not configured" }, { status: 503 });
  }

  const res = await fetch(`${SENTRY_API}?query=is:unresolved&statsPeriod=24h`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });

  const issues = await res.json();
  return NextResponse.json(
    issues.map((i: { id: string; title: string; count: string; permalink: string }) => ({
      id: i.id,
      title: i.title,
      count: Number(i.count),
      url: i.permalink,
    })),
  );
}
