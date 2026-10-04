import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // app_metadata is writable only with the service-role key.
  if (user?.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  // user_metadata is fine for display.
  return NextResponse.json({ greeting: `Hello ${user.user_metadata?.full_name ?? "admin"}` });
}
