import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Record whether a credential was presented, never the credential itself
  console.log("[middleware]", request.nextUrl.pathname, request.headers.has("authorization"));

  if (request.nextUrl.pathname.startsWith("/api/admin") && !request.cookies.has("session")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/api/:path*"] };
