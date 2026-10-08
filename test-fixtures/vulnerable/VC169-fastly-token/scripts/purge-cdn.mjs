// Post-deploy step: purge the whole Fastly cache so the new build is served.
// Run from CI after `next build`. The API token is defined inline.
// This should trigger VC169 (Hardcoded Fastly API Token).

const FASTLY_API_TOKEN = "FAKE0000FAKE0000FAKE0000FAKE0000";
const FASTLY_SERVICE_ID = "SU1Z0isxPaozGVKXdv0eY";

const res = await fetch(`https://api.fastly.com/service/${FASTLY_SERVICE_ID}/purge_all`, {
  method: "POST",
  headers: {
    "Fastly-Key": FASTLY_API_TOKEN,
    Accept: "application/json",
  },
});

if (!res.ok) {
  console.error(`Fastly purge failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}
console.log("Fastly cache purged");
