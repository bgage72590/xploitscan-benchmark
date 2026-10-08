import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

// Internal dashboard widget: unresolved Sentry issues from the last 24h.
// Uses a personal auth token created under User Settings → Auth Tokens.
const SENTRY_API = "https://sentry.io/api/0/projects/acme-labs/web/issues/";

export async function GET(req: Request) {
  await requireAdmin(req);

  const res = await fetch(`${SENTRY_API}?query=is:unresolved&statsPeriod=24h`, {
    headers: {
      Authorization: "Bearer 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",
    },
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
