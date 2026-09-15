// Client-side admin panel that talks to Supabase with the service_role key
// straight from the browser, so every row is reachable regardless of RLS.
// Fixture for VC004 (Supabase Client Without Row Level Security).

"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

// FAKE placeholder value — not a real key.
const SUPABASE_SERVICE_ROLE_KEY = "sb_service_role_EXAMPLE_0000_FAKE_KEY";

const supabase = createClient(
  "https://example0000.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY,
);

export default function AdminUsersPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("profiles").select("*");
      setUsers(data ?? []);
    }
    load();
  }, []);

  async function removeUser(id: string) {
    await supabase.auth.admin.deleteUser(id);
    await supabase.rpc("purge_user_records", { target_user: id });
    setUsers((prev) => prev.filter((u: any) => u.id !== id));
  }

  return (
    <ul>
      {users.map((u: any) => (
        <li key={u.id}>
          {u.email}
          <button onClick={() => removeUser(u.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
