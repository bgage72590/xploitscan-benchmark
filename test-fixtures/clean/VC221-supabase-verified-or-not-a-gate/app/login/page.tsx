import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginForm from "./login-form";

// A signed-in visitor is moved along to the dashboard, which checks the
// user itself. Nothing is granted on this session.
export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    redirect("/dashboard");
  }
  return <LoginForm />;
}
