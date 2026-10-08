import formData from "form-data";
import Mailgun from "mailgun.js";
import { randomUUID } from "crypto";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

// Campaign id attached to every login email so bounces can be grouped.
const LOGIN_CAMPAIGN_ID = "b34ee965-96be-4fd7-a156-de364dc0270c";

export async function sendMagicLink(to: string, link: string) {
  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: `Acme <login@${process.env.MAILGUN_DOMAIN}>`,
    to: [to],
    subject: "Your sign-in link",
    html: `<a href="${link}">Sign in to Acme</a>`,
    "h:X-Mailgun-Variables": JSON.stringify({ campaign: LOGIN_CAMPAIGN_ID, messageId: randomUUID() }),
  });
}
