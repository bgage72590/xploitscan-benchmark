import crypto from "crypto";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export async function requestPasswordReset(email: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("No user with that email exists");
  }

  const resetToken = crypto.createHash("sha256").update(user.email + Date.now()).digest("hex");

  await db.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) },
  });

  await sendPasswordResetEmail(user.email, resetToken);
}
