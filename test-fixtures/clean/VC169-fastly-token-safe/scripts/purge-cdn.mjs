// Post-deploy step: purge the whole Fastly cache. The token is injected by CI
// as a secret. VC169 must NOT fire.

const { FASTLY_API_TOKEN, FASTLY_SERVICE_ID } = process.env;
if (!FASTLY_API_TOKEN || !FASTLY_SERVICE_ID) {
  console.error("FASTLY_API_TOKEN and FASTLY_SERVICE_ID must be set");
  process.exit(1);
}

const res = await fetch(`https://api.fastly.com/service/${FASTLY_SERVICE_ID}/purge_all`, {
  method: "POST",
  headers: {
    "Fastly-Key": FASTLY_API_TOKEN,
    Accept: "application/json",
  },
});

if (!res.ok) {
  console.error(`Fastly purge failed: ${res.status}`);
  process.exit(1);
}
