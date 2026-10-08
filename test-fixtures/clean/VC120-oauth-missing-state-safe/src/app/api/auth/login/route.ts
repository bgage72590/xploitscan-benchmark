import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ISSUER = process.env.OAUTH_ISSUER!;
const CLIENT_ID = process.env.OAUTH_CLIENT_ID!;
const REDIRECT_URI = `${process.env.APP_URL}/api/auth/callback`;

const base64url = (buf: Buffer) => buf.toString("base64url");

// Authorization-code flow with PKCE (S256). The verifier stays in an httpOnly
// cookie and the callback must present it to redeem the code, so a code
// minted for someone else's challenge cannot be redeemed in this browser.
export async function GET() {
  const verifier = base64url(randomBytes(32));
  const challenge = base64url(createHash("sha256").update(verifier).digest());
  cookies().set("pkce_verifier", verifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 600,
  });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "openid profile email",
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  return NextResponse.redirect(`${ISSUER}/oauth/authorize?${params}`);
}
