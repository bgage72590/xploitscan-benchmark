// Sync newly signed-up users into Intercom so support can see who they're
// talking to. Called from the auth callback after the user row is created.
const INTERCOM_ACCESS_TOKEN = "dG9rOmE5YzY2NTZlXzM0NzBfMjFjYl81MjJjXzZiZjE4NDAwODRiMjoxOjA=";

type AppUser = { id: string; email: string; name: string | null; plan: string };

export async function upsertIntercomContact(user: AppUser) {
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
