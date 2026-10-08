import { createClient } from "@supabase/supabase-js";

// Browser client: anon key only. Row Level Security decides what it can see.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/** Whether the signed-in user holds the admin role (has_role is a SECURITY DEFINER SQL function). */
export async function isCurrentUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw error;
  return data === true;
}

/**
 * Deleting an account needs the privileged admin API, so it happens in an
 * Edge Function, never in the browser. The function checks the caller's role
 * itself; the anon client only forwards the caller's session.
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  const { error } = await supabase.functions.invoke("admin-delete-user", {
    body: { userId },
  });
  if (error) throw error;
}
