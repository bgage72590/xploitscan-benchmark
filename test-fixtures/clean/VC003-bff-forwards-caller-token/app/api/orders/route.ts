import { cookies } from "next/headers";

// A backend-for-frontend: the caller's own session cookie is forwarded to the
// API that checks it. Authentication is delegated, not absent.
export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("app_session")?.value;
  const res = await fetch(`${process.env.API_URL}/orders`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
  return Response.json(await res.json(), { status: res.status });
}
