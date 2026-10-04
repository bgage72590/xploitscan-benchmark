import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// The caller's Authorization header, or failing that their session cookie, is
// passed on to the billing API, which decides who they are.
export async function GET(req: Request) {
  const headers = new Headers({ accept: "application/json" });
  const authorization = req.headers.get("authorization");
  const sessionToken = (await cookies()).get("owner_session")?.value;
  if (authorization) {
    headers.set("authorization", authorization);
  } else if (sessionToken) {
    headers.set("authorization", `Bearer ${sessionToken}`);
  }
  const res = await fetch(`${process.env.BILLING_API_URL}/account/plan`, { cache: "no-store", headers });
  return new NextResponse(await res.text(), { status: res.status });
}
