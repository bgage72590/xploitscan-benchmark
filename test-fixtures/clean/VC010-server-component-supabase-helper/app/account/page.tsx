import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="mt-2 text-muted-foreground">Signed in as {profile?.full_name ?? user.email}</p>
      {profile?.role === "admin" && (
        <Link href="/admin" className="mt-6 inline-block underline">
          Admin dashboard
        </Link>
      )}
    </main>
  );
}
