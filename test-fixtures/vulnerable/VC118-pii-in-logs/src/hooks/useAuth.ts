import { useEffect, useState } from "react";
import { api } from "../lib/api";

type User = { id: string; email: string };

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useAuth mount, stored session:", localStorage.getItem("token"));
    api
      .get<User>("/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
