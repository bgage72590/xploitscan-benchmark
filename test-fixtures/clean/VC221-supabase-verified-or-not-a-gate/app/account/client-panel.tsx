"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ClientPanel() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setEmail(session.user.email ?? null);
    });
  }, []);
  return <p>{email}</p>;
}
