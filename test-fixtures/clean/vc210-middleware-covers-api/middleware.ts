// Auth middleware whose matcher INCLUDES /api (the Clerk default shape) — API
// routes are covered, so VC210 must NOT fire.
import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware();
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/(api|trpc)(.*)"],
};
