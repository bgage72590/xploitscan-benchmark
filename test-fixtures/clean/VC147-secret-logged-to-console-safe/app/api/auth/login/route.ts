import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}
console.log("JWT secret configured:", Boolean(JWT_SECRET));

export async function POST(req: Request) {
  const { email, password } = await req.json();
  console.log("Login attempt for", email);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    console.warn("Invalid credentials for", email);
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  let token: string;
  try {
    token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  } catch (err) {
    console.error("Failed to sign session token:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
  console.log(`Issued session for user ${user.id}`);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
  return res;
}
