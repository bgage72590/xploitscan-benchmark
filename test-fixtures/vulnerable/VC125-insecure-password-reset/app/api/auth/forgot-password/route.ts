import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { error: "No account found with that email address" },
      { status: 404 },
    );
  }

  // Generate a reset token and store it on the user
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token },
  });

  await resend.emails.send({
    from: "Acme <noreply@acme.dev>",
    to: email,
    subject: "Reset your password",
    html: `<a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}">Reset password</a>`,
  });

  return NextResponse.json({ message: "Password reset link sent" });
}
