import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? "";
  // Reads the claims straight out of the token: the signature is never checked.
  const claims = JSON.parse(atob(token.split(".")[1]));
  if (claims.role !== "admin") return new Response("Forbidden", { status: 403 });
  const { userId } = await req.json();
  await supabaseAdmin.from("users").delete().eq("id", userId);
  return new Response("ok");
}
