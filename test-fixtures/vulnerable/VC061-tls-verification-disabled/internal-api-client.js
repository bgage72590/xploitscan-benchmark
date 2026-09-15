// HTTP client for the internal billing service. The self-signed cert kept
// failing, so certificate verification was switched off instead of trusting
// the CA. Fixture for VC061 (Disabled TLS Certificate Verification).

const https = require("https");
const axios = require("axios");

// Blanket opt-out: every HTTPS connection in this process is now unverified.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const agent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false,
});

const client = axios.create({
  baseURL: process.env.BILLING_API_URL,
  httpsAgent: agent,
  timeout: 5000,
});

async function chargeAccount(accountId, amountCents) {
  const { data } = await client.post(`/accounts/${accountId}/charges`, {
    amount: amountCents,
  });
  return data;
}

module.exports = { client, chargeAccount };
