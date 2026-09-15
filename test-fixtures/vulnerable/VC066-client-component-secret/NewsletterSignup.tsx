// Next.js App Router client component that calls the mail provider directly
// from the browser, reading a server-only env var to authenticate.
// Triggers VC066 (Secret Used in Client Component).
"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    // This env var is server-only, but the component is bundled for the
    // browser, so Next.js inlines whatever value it has at build time.
    await fetch("https://api.example-mail.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAILER_API_TOKEN}`,
      },
      body: JSON.stringify({ email, listId: process.env.MAILER_LIST_ID }),
    });

    setStatus("done");
  }

  return (
    <form onSubmit={subscribe}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <button type="submit" disabled={status !== "idle"}>
        {status === "done" ? "Subscribed" : "Subscribe"}
      </button>
    </form>
  );
}
