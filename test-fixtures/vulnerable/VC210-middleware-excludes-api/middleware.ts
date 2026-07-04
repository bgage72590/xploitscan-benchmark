// Clerk auth middleware whose matcher excludes /api — API routes never hit it.
import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware();
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
