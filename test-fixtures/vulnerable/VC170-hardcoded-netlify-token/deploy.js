// Deploy script that uploads the built site to Netlify and updates the site's
// build settings. The personal access token is committed in the repo.
// This should trigger VC170 (Hardcoded Netlify Personal Access Token).

const NETLIFY_API = "https://api.netlify.com/api/v1";
const NETLIFY_SITE_ID = "acme-marketing-site";
const NETLIFY_TOKEN = "nfp_FAKE0000000000000000000000";

async function netlify(path, init = {}) {
  return fetch(`${NETLIFY_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${NETLIFY_TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

export async function deployZip(zipBuffer) {
  const res = await netlify(`/sites/${NETLIFY_SITE_ID}/deploys`, {
    method: "POST",
    headers: { "Content-Type": "application/zip" },
    body: zipBuffer,
  });
  if (!res.ok) throw new Error(`Netlify deploy failed: ${res.status}`);
  const deploy = await res.json();
  console.log(`Deployed ${deploy.id} -> ${deploy.ssl_url}`);
  return deploy;
}
