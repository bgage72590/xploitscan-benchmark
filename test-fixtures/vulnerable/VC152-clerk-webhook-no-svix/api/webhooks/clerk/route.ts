import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const payload = await req.json();
  if (payload.type === "user.created") {
    await clerkClient.users.updateUser(payload.data.id, {
      publicMetadata: { onboarded: true },
    });
  }
  return new Response("ok");
}
