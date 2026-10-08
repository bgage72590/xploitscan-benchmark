import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

const GENERIC = { message: "If an account exists for that email, you'll receive a reset link shortly." };

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal whether the email is registered
    return NextResponse.json(GENERIC);
  }

  // 256-bit token from the CSPRNG; only its hash is stored, and it expires
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: tokenHash, resetTokenExpiry: new Date(Date.now() + 30 * 60 * 1000) },
  });

  await resend.emails.send({
    from: "Acme <noreply@acme.dev>",
    to: email,
    subject: "Reset your password",
    html: `<a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}">Reset password</a>`,
  });

  return NextResponse.json(GENERIC);
}
