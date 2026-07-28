// Byte-for-byte the shape of clean/VC003-inline-silenced, minus the
// `// VC003-OK:` markers. If this stops firing, the inline-silencer support
// added to VC003 has turned into a blanket disable — which is the failure
// mode a clean fixture alone cannot catch.
export async function GET() {
  return Response.json({ image: "og" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ ok: true, echo: body.label });
}
