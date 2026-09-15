// Next.js client component that calls the Clerk backend API from the browser,
// pulling the Clerk secret key into the client bundle.
// This should trigger VC018 (Exposed Clerk/Auth Secret Key).

"use client";

import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://api.clerk.com/v1/users?limit=50", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLERK_SECRET_KEY}`,
      },
    })
      .then((r) => r.json())
      .then(setUsers);
  }, []);

  return (
    <ul>
      {users.map((u: { id: string; email: string }) => (
        <li key={u.id}>{u.email}</li>
      ))}
    </ul>
  );
}
