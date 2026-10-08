import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

// Login endpoint. A debug log added while wiring up the form was never
// removed: every sign-in writes the submitted email AND plaintext password
// to the hosting provider's log stream, readable by anyone with dashboard
// access and retained for weeks. VC097 must fire.
export async function POST(request: Request) {
  const body = await request.json();
  console.log("Login attempt:", body);

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ id: user.id, email: user.email });
}
