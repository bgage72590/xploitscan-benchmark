// Resend client for transactional email, keyed from the server environment.
// VC166 must NOT fire.
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReceipt(to, orderId) {
  return resend.emails.send({
    from: "Acme <orders@acme.dev>",
    to,
    subject: `Your order ${orderId}`,
    html: `<p>Thanks for your order ${orderId}.</p>`,
  });
}
