// Cloudflare API client with a hardcoded API token.
// Tokens are 40-char alphanumeric without a prefix; VC168 anchors on the
// CLOUDFLARE_API_TOKEN variable name. VC168 must fire.

// Real Cloudflare API tokens are exactly 40 alphanumeric characters.
const CLOUDFLARE_API_TOKEN = "abcdef1234567890ABCDEF1234567890aBcDeFgh";

export async function purgeCache(zoneId: string) {
  await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ purge_everything: true }),
  });
}
