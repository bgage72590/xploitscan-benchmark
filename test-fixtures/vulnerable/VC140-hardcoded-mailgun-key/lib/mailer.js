// Legacy mailer (mailgun-js) used by the invoice worker.
const mailgun = require("mailgun-js")({
  apiKey: "key-cnnc39xmmb6la7tm00rvnku9nmn29pbd",
  domain: "mg.acme.dev",
});

function sendInvoice(to, invoiceUrl) {
  return mailgun.messages().send({
    from: "Acme Billing <billing@mg.acme.dev>",
    to,
    subject: "Your invoice is ready",
    text: `Download your invoice: ${invoiceUrl}`,
  });
}

module.exports = { sendInvoice };
