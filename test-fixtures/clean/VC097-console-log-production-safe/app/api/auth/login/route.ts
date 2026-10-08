import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { logger } from "@/lib/logger";

// Login endpoint. Sign-ins are recorded through the structured logger, with
// only the outcome and the user id — never the submitted body — and the
// logger's level is set per environment. VC097 must NOT fire.
export async function POST(request: Request) {
  const body = await request.json();

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    logger.warn({ event: "login_failed" }, "login failed");
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await createSession(user.id);
  logger.info({ event: "login_succeeded", userId: user.id }, "login succeeded");
  return NextResponse.json({ id: user.id, email: user.email });
}
