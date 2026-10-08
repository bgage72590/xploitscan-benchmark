// Legacy mailer (mailgun-js) used by the invoice worker.
const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

function sendInvoice(to, invoiceUrl) {
  return mailgun.messages().send({
    from: `Acme Billing <billing@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject: "Your invoice is ready",
    text: `Download your invoice: ${invoiceUrl}`,
  });
}

module.exports = { sendInvoice };
