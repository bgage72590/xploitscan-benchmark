import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "user" | "admin";
  created_at: string;
}

export default function AdminUsers() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      setUsers(data ?? []);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const handlePromote = async (id: string) => {
    const { error } = await supabase.from("profiles").update({ role: "admin" }).eq("id", id);
    if (error) return toast.error(error.message);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: "admin" } : u)));
    toast.success("User promoted to admin");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted");
  };

  if (loading) return <div className="p-8">Loading…</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-2xl font-bold">Users</h1>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td>{u.email}</td>
              <td>{u.full_name}</td>
              <td>
                <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
              </td>
              <td className="space-x-2 text-right">
                {profile?.role === "admin" && (
                  <>
                    <Button size="sm" onClick={() => handlePromote(u.id)}>
                      Make admin
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
