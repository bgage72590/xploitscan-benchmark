// Public-by-design endpoints carrying an explicit, rule-scoped silencer.
// The README tells users to prefer `// VC<id>-OK: <reason>` over a path-wide
// ignore rule for a single reviewed-and-accepted finding; this fixture is the
// proof that VC003 actually honors it.
//
// Paired with vulnerable/VC003-missing-auth, which is the same shape WITHOUT
// the marker and must still fire. Together they prove the marker is what
// suppresses the finding, not a weakened rule.

// VC003-OK: Open Graph image. No input, no data access — social crawlers
// fetch this unauthenticated by definition.
export async function GET() {
  return Response.json({ image: "og" });
}

// VC003-OK: embeddable status badge, public on purpose
export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ ok: true, echo: body.label });
}
