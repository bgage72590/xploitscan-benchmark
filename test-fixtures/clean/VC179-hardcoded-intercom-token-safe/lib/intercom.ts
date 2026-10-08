// Sync newly signed-up users into Intercom so support can see who they're
// talking to. Called from the auth callback after the user row is created.
// The token is provisioned as a server-only environment variable.
const INTERCOM_ACCESS_TOKEN = process.env.INTERCOM_ACCESS_TOKEN;

type AppUser = { id: string; email: string; name: string | null; plan: string };

export async function upsertIntercomContact(user: AppUser) {
  if (!INTERCOM_ACCESS_TOKEN) throw new Error("INTERCOM_ACCESS_TOKEN is not set");

  const res = await fetch("https://api.intercom.io/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${INTERCOM_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Intercom-Version": "2.11",
    },
    body: JSON.stringify({
      role: "user",
      external_id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      custom_attributes: { plan: user.plan },
    }),
  });

  if (!res.ok) {
    console.error("Intercom contact sync failed", res.status);
  }
}
