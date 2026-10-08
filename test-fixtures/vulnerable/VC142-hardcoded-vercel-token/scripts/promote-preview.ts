// Promotes the latest READY preview deployment to production and syncs the
// Stripe webhook secret into the project's environment variables.
// Run with: npx tsx scripts/promote-preview.ts

const VERCEL_TOKEN = "Kq3v8Xn2Lp7Rt5Wy9Bz4Mc6D";
const TEAM_ID = "team_4hT9aQ2mVx7LkP0sZr3N";
const PROJECT_ID = "prj_8WcN2xQe5LrT1yVb7KsM0dHa";

const api = (path: string, init: RequestInit = {}) =>
  fetch(`https://api.vercel.com${path}${path.includes("?") ? "&" : "?"}teamId=${TEAM_ID}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

async function main() {
  const res = await api(`/v6/deployments?projectId=${PROJECT_ID}&target=preview&state=READY&limit=1`);
  const { deployments } = await res.json();
  if (!deployments?.length) {
    console.log("No ready preview deployment found");
    return;
  }

  const latest = deployments[0];
  console.log(`Promoting ${latest.url} to production...`);
  await api(`/v10/projects/${PROJECT_ID}/promote/${latest.uid}`, { method: "POST" });

  await api(`/v10/projects/${PROJECT_ID}/env?upsert=true`, {
    method: "POST",
    body: JSON.stringify({
      key: "STRIPE_WEBHOOK_SECRET",
      value: process.argv[2],
      type: "encrypted",
      target: ["production"],
    }),
  });
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
