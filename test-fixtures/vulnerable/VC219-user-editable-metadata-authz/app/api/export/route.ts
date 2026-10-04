import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // app_metadata first looks safe, but a user with no app_metadata role falls
  // through to user_metadata, which they can set themselves.
  const role = user.app_metadata?.role ?? user.user_metadata?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data } = await supabase.from("invoices").select("*");
  return NextResponse.json(data);
}
