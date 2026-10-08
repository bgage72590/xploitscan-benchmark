import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;
console.log("JWT_SECRET loaded:", JWT_SECRET);

export async function POST(req: Request) {
  const { email, password } = await req.json();
  console.log("Login attempt:", { email, password });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    console.warn("Invalid credentials for", email);
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  console.log(`Issued session for ${email}: ${token}`);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
  return res;
}
