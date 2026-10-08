import sgMail from "@sendgrid/mail";

sgMail.setApiKey("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");

const FROM = "Acme <hello@acme.dev>";

export async function sendWelcomeEmail(to: string, name: string) {
  await sgMail.send({
    to,
    from: FROM,
    subject: "Welcome to Acme",
    html: `<p>Hi ${name}, thanks for signing up!</p>`,
  });
}

export async function sendReceipt(to: string, orderId: string, totalCents: number) {
  await sgMail.send({
    to,
    from: FROM,
    subject: `Your receipt for order ${orderId}`,
    text: `Thanks for your order. Total: $${(totalCents / 100).toFixed(2)}`,
  });
}
