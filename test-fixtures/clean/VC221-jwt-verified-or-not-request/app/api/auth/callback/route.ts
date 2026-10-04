import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// OAuth code exchange: the ID token comes straight back from the provider's
// token endpoint over TLS, not from the browser.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenRes = await fetch("https://oauth2.example.com/token", {
    method: "POST",
    body: new URLSearchParams({ code: code ?? "", grant_type: "authorization_code" }),
  });
  const tokens = await tokenRes.json();
  const profile = jwt.decode(tokens.id_token) as { sub: string; email: string };
  return NextResponse.json({ email: profile.email });
}
