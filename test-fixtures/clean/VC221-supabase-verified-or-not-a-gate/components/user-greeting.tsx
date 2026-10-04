import { createClient } from "@/utils/supabase/server";

// Echoes the signed-in email back to the person who sent the cookie.
export default async function UserGreeting() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session ? <span>Hey, {session.user.email}!</span> : null;
}
