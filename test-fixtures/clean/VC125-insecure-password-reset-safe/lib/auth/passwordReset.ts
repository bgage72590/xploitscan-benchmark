import crypto from "crypto";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

// Callers return the same "check your inbox" message whether or not this
// finds an account, so the response never reveals which emails exist.
export async function requestPasswordReset(email: string): Promise<void> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  await db.user.update({
    where: { id: user.id },
    data: { resetToken: resetTokenHash, resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) },
  });

  await sendPasswordResetEmail(user.email, resetToken);
}
