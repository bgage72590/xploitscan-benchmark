import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // getSession() only to read the access token we forward; the gate above
  // is getUser(), which asks the Auth server.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch(`${process.env.API_URL}/projects`, {
    headers: { Authorization: `Bearer ${session?.access_token}` },
  });
  return NextResponse.json(await res.json());
}
