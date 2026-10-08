"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        setError(error.message);
        return;
      }
      setUsers(data.users);
    };
    fetchUsers();
  }, []);

  const deleteUser = async (userId: string) => {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      setError(error.message);
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      <ul className="divide-y">
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between py-2">
            <span>{user.email}</span>
            <button onClick={() => deleteUser(user.id)} className="text-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
