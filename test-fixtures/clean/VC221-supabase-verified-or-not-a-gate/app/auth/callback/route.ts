import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// OAuth callback: the session read here is the one exchangeCodeForSession()
// just obtained from Supabase Auth and stored, not the caller's cookie.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarded")
        .eq("id", session!.user.id)
        .single();
      return NextResponse.redirect(`${origin}${profile?.onboarded ? "/dashboard" : "/onboarding"}`);
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
