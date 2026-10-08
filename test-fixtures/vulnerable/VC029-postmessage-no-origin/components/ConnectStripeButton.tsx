"use client";

// Opens the OAuth consent screen in a popup and waits for the callback page
// to post the result back. The listener accepts a message from ANY window —
// any site that can get a reference to this tab (window.open, an iframe, a
// link with target=_blank) can post a fake "oauth:success" and choose where
// the user is sent next.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OAuthMessage = {
  type: "oauth:success" | "oauth:error";
  accountId?: string;
  redirectTo?: string;
  error?: string;
};

export function ConnectStripeButton() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">("idle");

  useEffect(() => {
    const handleMessage = (event: MessageEvent<OAuthMessage>) => {
      const data = event.data;
      if (data.type === "oauth:success") {
        setStatus("done");
        localStorage.setItem("stripeAccountId", data.accountId ?? "");
        router.push(data.redirectTo ?? "/dashboard");
      } else if (data.type === "oauth:error") {
        setStatus("error");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  const connect = () => {
    setStatus("pending");
    window.open("/api/stripe/connect", "stripe-oauth", "width=520,height=720");
  };

  return (
    <button onClick={connect} disabled={status === "pending"}>
      {status === "done" ? "Stripe connected" : "Connect Stripe"}
    </button>
  );
}
