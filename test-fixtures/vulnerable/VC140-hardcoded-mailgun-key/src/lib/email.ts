import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);

// Sending key from the Mailgun dashboard (API Security → Add new key).
const mg = mailgun.client({
  username: "api",
  key: "62f6793ba44ab567ab90d6f4c1b38dbf-d3b1ad48-11c87f89",
});

export async function sendMagicLink(to: string, link: string) {
  await mg.messages.create("mg.acme.dev", {
    from: "Acme <login@mg.acme.dev>",
    to: [to],
    subject: "Your sign-in link",
    html: `<a href="${link}">Sign in to Acme</a>`,
  });
}
